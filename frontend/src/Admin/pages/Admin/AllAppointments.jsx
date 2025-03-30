import React, { useEffect } from 'react';
import { assets } from '../../assets/assets';
import { useContext } from 'react';
import { AdminContext } from '../../context/AdminContext';
import { AppContext } from '../../context/AdminAppContext';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/AdminNavbar';

const AllAppointments = () => {
  const { aToken, appointments, cancelAppointment, getAllAppointments } = useContext(AdminContext);
  const { slotDateFormat, calculateAge, currency } = useContext(AppContext);

  useEffect(() => {
    if (aToken) {
      getAllAppointments();
    }
  }, [aToken]);

  return (
    <>
      <div className="flex flex-col lg:flex-row gap-5 p-5">
        <Sidebar />
        <div className="flex-1">
          <p className="mb-5 text-lg font-semibold">All Appointments</p>

          <div className="bg-white border rounded-lg text-sm max-h-[80vh] overflow-y-auto shadow-sm">
            {/* Table Header */}
            <div className="hidden md:grid grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] py-3 px-6 border-b bg-gray-100 text-gray-600 font-medium">
              <p>#</p>
              <p>Patient</p>
              <p>Age</p>
              <p>Date & Time</p>
              <p>Doctor</p>
              <p>Fees</p>
              <p>Action</p>
            </div>

            {/* Appointment Rows */}
            {appointments.map((item, index) => (
              <div
                className="flex flex-col md:grid md:grid-cols-[0.5fr_2.5fr_1fr_2.5fr_2.5fr_1fr_1fr] gap-4 md:gap-0 items-center py-3 px-4 border-b hover:bg-gray-50 transition duration-150"
                key={index}
              >
                <p className="md:block hidden text-gray-500">{index + 1}</p>

                {/* Patient Details */}
                <div className="flex items-center gap-3">
                  <img src={item.userData.image} className="w-10 h-10 rounded-full object-cover" alt="" />
                  <p className="text-gray-700">{item.userData.name}</p>
                </div>

                {/* Age */}
                <p className="hidden md:block text-gray-500">{calculateAge(item.userData.dob)}</p>

                {/* Date & Time */}
                <p className="text-gray-600">
                  {slotDateFormat(item.slotDate)}, {item.slotTime}
                </p>

                {/* Doctor Info */}
                <div className="flex items-center gap-3">
                  <img src={item.docData.image} className="w-10 h-10 rounded-full bg-gray-200 object-cover" alt="" />
                  <p className="text-gray-700">{item.docData.name}</p>
                </div>

                {/* Fees */}
                <p className="text-gray-600">
                  {currency}
                  {item.amount}
                </p>

                {/* Action Button */}
                {item.cancelled ? (
                  <p className="text-red-500 text-xs font-semibold">Cancelled</p>
                ) : item.isCompleted ? (
                  <p className="text-green-500 text-xs font-semibold">Completed</p>
                ) : (
                  <img
                    onClick={() => cancelAppointment(item._id)}
                    className="w-10 cursor-pointer hover:opacity-80 transition-opacity duration-200"
                    src={assets.cancel_icon}
                    alt="Cancel Appointment"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default AllAppointments;
