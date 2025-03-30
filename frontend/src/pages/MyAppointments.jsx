import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../context/AppContext';
import axios from 'axios';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import { PayPalButtons, PayPalScriptProvider } from "@paypal/react-paypal-js";

const MyAppointments = () => {
    const { backendUrl, token } = useContext(AppContext);
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] = useState(null);
    const [exchangeRate, setExchangeRate] = useState(null);

    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const slotDateFormat = (slotDate) => {
        const dateArray = slotDate.split('_');
        return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2];
    };

    const getUserAppointments = async () => {
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/appointments`, { headers: { token } });
            setAppointments(data.appointments.reverse());
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const cancelAppointment = async (appointmentId) => {
        try {
            const { data } = await axios.post(`${backendUrl}/api/user/cancel-appointment`, { appointmentId }, { headers: { token } });
            if (data.success) {
                toast.success(data.message);
                getUserAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.message);
        }
    };

    const approveAppointment = async (orderId, appointmentId) => {
        try {
            const payload = { orderId, appointmentId };
            const { data } = await axios.post(`${backendUrl}/api/user/approve-appointment`, payload, {
                headers: { token },
            });
    
            if (data.success) {
                toast.success("Payment successful and appointment approved!");
                getUserAppointments();
            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error("Error approving the appointment:", error.response?.data || error.message);
            toast.error("Something went wrong while approving the appointment.");
        }
    };
    
    useEffect(() => {
        if (token) getUserAppointments();
        fetchExchangeRate();
    }, [token]);

    const fetchExchangeRate = async () => {
        try {
            const response = await axios.get("https://api.exchangerate-api.com/v4/latest/INR");
            setExchangeRate(response.data.rates.USD);
        } catch (error) {
            console.error("Error fetching exchange rate:", error);
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
        <p className="pb-4 text-xl font-semibold text-gray-700 border-b">My Appointments</p>
        <div className="space-y-6 mt-4">
            {appointments.map((item, index) => (
                <div key={index} className="flex items-center gap-6 p-4 border rounded-lg shadow-sm">
                    <div className="w-36 h-36 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                        <img className="w-full h-full object-cover" src={item.docData.image} alt="Doctor" />
                    </div>
                    {/* <p className="mt-1 text-blue-600 font-medium">
                        Amount: ₹{item.amount} ({exchangeRate ? (item.amount * exchangeRate).toFixed(2) : "Fetching..."} USD)
                    </p> */}
                    <div className="flex-1 text-sm text-gray-600 space-y-1">
                        <p className="text-lg font-semibold text-gray-900">{(item.docData.name).toUpperCase()}</p>
                        <p className="text-gray-500">{item.docData.speciality}</p>
                        <p className="font-medium text-gray-700 mt-2">Address:</p>
                        <p>Primary: {item.docData.address.line1}<br/>
                            Secondary: {item.docData.address.line2}</p>
                        <p className="mt-1 text-gray-800 font-medium">
                            Appointment Date & Time: {slotDateFormat(item.slotDate)} | {item.slotTime}
                        </p>
                        <p className="mt-1 text-gray-800 font-medium">
                            Fee: ₹{item.amount}
                        </p>
                    </div>
                    <div className="flex flex-col gap-3 text-sm text-center">
                        {!item.cancelled && !item.payment && !item.isCompleted && (
                            <button 
                                onClick={() => setSelectedAppointment(item)}
                                className="py-2 px-4 border rounded-lg bg-blue-500 text-white hover:bg-blue-600 transition">
                                Pay with PayPal
                            </button>
                        )}
                        {selectedAppointment && selectedAppointment._id === item._id && (
                            <PayPalScriptProvider options={{ "client-id": "AZ6GgQiifJurD1LUrIc99IJRHdlHNFxTEVvrGc0BuNjMKCSF61UC1n0bMR0-GzGFuKBO2sRJ1Qh6r7qe" }}>
                                <PayPalButtons
                                    createOrder={(data, actions) => {
                                        return actions.order.create({
                                            purchase_units: [{
                                                amount: {
                                                    value: (item.amount * exchangeRate).toFixed(2),
                                                    currency_code: "USD"
                                                },
                                            }],
                                        });
                                    }}
                                    onApprove={(data) => {
                                        approveAppointment(data.orderID, item._id);
                                    }}
                                />
                            </PayPalScriptProvider>
                        )}
                        {item.payment && !item.isCompleted && (
                            <button className="py-2 px-4 border rounded-lg bg-green-100 text-green-700">Paid</button>
                        )}
                        {item.isCompleted && (
                            <button className="py-2 px-4 border rounded-lg bg-green-500 text-white">Completed</button>
                        )}
                        {!item.cancelled && !item.isCompleted && (
                            <button 
                                onClick={() => cancelAppointment(item._id)}
                                className="py-2 px-4 border rounded-lg bg-red-500 text-white hover:bg-red-600 transition">
                                Cancel Appointment
                            </button>
                        )}
                        {item.cancelled && (
                            <button className="py-2 px-4 border rounded-lg bg-red-100 text-red-700">Appointment Cancelled</button>
                        )}
                    </div>
                </div>
            ))}
        </div>
    </div>
    );
};

export default MyAppointments;
