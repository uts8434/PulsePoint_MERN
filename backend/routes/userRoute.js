import express from 'express';
import { loginUser, registerUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment,verifyemail,UpdatePass,approveAppointment } from '../controllers/userController.js';
import upload from '../middleware/multer.js';
import authUser from '../middleware/authUser.js';
const userRouter = express.Router();

userRouter.post("/register", registerUser)
userRouter.post("/login", loginUser)

userRouter.get("/get-profile", authUser, getProfile)
userRouter.post("/update-profile", upload.single('image'), authUser, updateProfile)
userRouter.post("/book-appointment", authUser, bookAppointment)
userRouter.get("/appointments", authUser, listAppointment)
userRouter.post("/cancel-appointment", authUser, cancelAppointment)
// userRouter.post("/payment-paypal", authUser, paymentpaypal)
userRouter.post("/approve-appointment", authUser, approveAppointment)

userRouter.post("/verifyemail", verifyemail)
userRouter.post("/UpdatePass", UpdatePass)
// userRouter.delete("/deleteprofile",authUser, deleteProfile)

export default userRouter;