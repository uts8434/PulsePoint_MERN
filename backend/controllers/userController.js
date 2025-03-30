import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import validator from "validator";
import userModel from "../models/userModel.js";
import doctorModel from "../models/doctorModel.js";
import appointmentModel from "../models/appointmentModel.js";
import { v2 as cloudinary } from 'cloudinary'
import axios from "axios";
import paypal from "@paypal/checkout-server-sdk";

// Gateway Initialize
const environment = new paypal.core.SandboxEnvironment(
    process.env.PAYPAL_CLIENT_ID,
    process.env.PAYPAL_CLIENT_SECRET
);
const client = new paypal.core.PayPalHttpClient(environment);

// API to register user
const registerUser = async (req, res) => {

    try {
        const { name, email, password } = req.body;

        // checking for all data to register user
        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // hashing user password
        const salt = await bcrypt.genSalt(10); // the more no. round the more time it will take
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword,
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        res.json({ success: true, token })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to login user
const loginUser = async (req, res) => {

    try {
        const { email, password } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)
            res.json({ success: true, token })
        }
        else {
            res.json({ success: false, message: "Invalid credentials" })
        }
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user profile data
const getProfile = async (req, res) => {

    try {
        const { userId } = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}
  

// API to update user profile
const updateProfile = async (req, res) => {

    try {

        const { userId, name, phone, address, dob, gender } = req.body
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({ success: false, message: "Data Missing" })
        }

        await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender })

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" })
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId, { image: imageURL })
        }

        res.json({ success: true, message: 'Profile Updated' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to book appointment 
const bookAppointment = async (req, res) => {

    try {

        const { userId, docId, slotDate, slotTime } = req.body
        const docData = await doctorModel.findById(docId).select("-password")

        if (!docData.available) {
            return res.json({ success: false, message: 'Doctor Not Available' })
        }

        let slots_booked = docData.slots_booked

        // checking for slot availablity 
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({ success: false, message: 'Slot Not Available' })
            }
            else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select("-password")

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save()

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Booked' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel appointment
const cancelAppointment = async (req, res) => {
    try {

        const { userId, appointmentId } = req.body
        const appointmentData = await appointmentModel.findById(appointmentId)

        // verify appointment user 
        if (appointmentData.userId !== userId) {
            return res.json({ success: false, message: 'Unauthorized action' })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot 
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: 'Appointment Cancelled' })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to get user appointments for frontend my-appointments page
const listAppointment = async (req, res) => {
    try {

        const { userId } = req.body
        const appointments = await appointmentModel.find({ userId })

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to make payment of appointment using razorpay
const approveAppointment = async (req, res) => {
    try {
        const { orderId, appointmentId } = req.body;
        console.log("Received orderId:", orderId, "and appointmentId:", appointmentId);

        if (!orderId || !appointmentId) {
            return res.status(400).json({ success: false, message: "Missing orderId or appointmentId" });
        }

        console.log("Verifying PayPal payment for Order ID:", orderId);

        // PayPal API Authentication
        const auth = Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64');
        const PAYPAL_API = "https://api-m.sandbox.paypal.com";

        // Fetch order details
        const { data } = await axios.get(`${PAYPAL_API}/v2/checkout/orders/${orderId}`, {
            headers: {
                Authorization: `Basic ${auth}`,
                'Content-Type': 'application/json',
            },
        });

        console.log("PayPal Order Response:", JSON.stringify(data, null, 2));

        // If payment is "APPROVED", capture it
        if (data.status === "APPROVED") {
            console.log("Capturing PayPal payment...");

            const captureResponse = await axios.post(`${PAYPAL_API}/v2/checkout/orders/${orderId}/capture`, {}, {
                headers: {
                    Authorization: `Basic ${auth}`,
                    'Content-Type': 'application/json',
                },
            });

            console.log("Capture Response:", JSON.stringify(captureResponse.data, null, 2));

            if (captureResponse.data.status !== "COMPLETED") {
                return res.status(400).json({ success: false, message: `Payment capture failed. Status: ${captureResponse.data.status}` });
            }
        } else if (data.status !== "COMPLETED") {
            return res.status(400).json({ success: false, message: `Payment not completed. Status: ${data.status}` });
        }

        console.log("Searching for appointment with ID:", appointmentId);

        const appointment = await appointmentModel.findById(appointmentId);
        if (!appointment) {
            return res.status(404).json({ success: false, message: "Appointment not found." });
        }

        // Update appointment status
        appointment.payment = true;
        appointment.isCompleted = true;
        await appointment.save();

        res.json({ success: true, message: "Appointment approved successfully." });

    } catch (error) {
        console.error("Error in approveAppointment:", error);
        res.status(500).json({ success: false, message: "Internal server error." });
    }
};






// API to verify payment of razorpay
// const verifyRazorpay = async (req, res) => {
//     try {
//         const { razorpay_order_id } = req.body
//         const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)

//         if (orderInfo.status === 'paid') {
//             await appointmentModel.findByIdAndUpdate(orderInfo.receipt, { payment: true })
//             res.json({ success: true, message: "Payment Successful" })
//         }
//         else {
//             res.json({ success: false, message: 'Payment Failed' })
//         }
//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// API to make payment of appointment using Stripe
// const paymentStripe = async (req, res) => {
//     try {

//         const { appointmentId } = req.body
//         const { origin } = req.headers

//         const appointmentData = await appointmentModel.findById(appointmentId)

//         if (!appointmentData || appointmentData.cancelled) {
//             return res.json({ success: false, message: 'Appointment Cancelled or not found' })
//         }

//         const currency = process.env.CURRENCY.toLocaleLowerCase()

//         const line_items = [{
//             price_data: {
//                 currency,
//                 product_data: {
//                     name: "Appointment Fees"
//                 },
//                 unit_amount: appointmentData.amount * 100
//             },
//             quantity: 1
//         }]

//         const session = await stripeInstance.checkout.sessions.create({
//             success_url: `${origin}/verify?success=true&appointmentId=${appointmentData._id}`,
//             cancel_url: `${origin}/verify?success=false&appointmentId=${appointmentData._id}`,
//             line_items: line_items,
//             mode: 'payment',
//         })

//         res.json({ success: true, session_url: session.url });

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }
// }

// const verifyStripe = async (req, res) => {
//     try {

//         const { appointmentId, success } = req.body

//         if (success === "true") {
//             await appointmentModel.findByIdAndUpdate(appointmentId, { payment: true })
//             return res.json({ success: true, message: 'Payment Successful' })
//         }

//         res.json({ success: false, message: 'Payment Failed' })

//     } catch (error) {
//         console.log(error)
//         res.json({ success: false, message: error.message })
//     }

// }

const verifyemail = async (req, res) => {

    try {
        const { email } = req.body;
        const user = await userModel.findOne({ email })

        if (!user) {
            return res.json({ success: false, message: "User does not exist" })
        }

        res.json({ success: true, message: "Email Verified" })
        
    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

const UpdatePass = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);
  
      // Find the user by email and update the password
      const user = await userModel.findOneAndUpdate(
        { email },
        { $set: { password: hashedPassword } },
        { new: true } // Return the updated document
      );
      if (!user) {
        return res.status(404).json({ success: false, message: 'Email not found.' });
      }
  
      res.status(200).json({ success: true, message: 'Password updated successfully.' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ success: false, message: 'Error updating password. Please try again.' });
    }  
}

const deleteProfile = async (req, res) => {
    try {
      const userId = req.body.userId; // Get userId from middleware
      if (!userId) {
        return res.status(400).json({ success: false, message: "User ID not found in request" });
      }
  
      const user = await userModel.findByIdAndDelete(userId); // Delete user from database
  
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found!" });
      }
  
      res.json({ success: true, message: "User profile deleted successfully!" });
    } catch (error) {
      console.error("Server error:", error);
      res.status(500).json({ success: false, message: "Server error!" });
    }
  };
  

export {
    deleteProfile,
    loginUser,
    registerUser,
    getProfile,
    updateProfile,
    bookAppointment,
    listAppointment,
    cancelAppointment,
    approveAppointment,
   
    verifyemail,
    UpdatePass

}