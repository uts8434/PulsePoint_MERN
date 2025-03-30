import React, { useContext, useEffect } from 'react'
import { assets } from '../../assets/assets'
import { AdminContext } from '../../context/AdminContext'
import { AppContext } from '../../context/AdminAppContext'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/AdminNavbar'

const Dashboard = () => {

  const { aToken, getDashData, cancelAppointment, dashData } = useContext(AdminContext)
  const { slotDateFormat } = useContext(AppContext)

  useEffect(() => {
    if (aToken) {
      getDashData()
    }
  }, [aToken])

  return dashData && (
   <>
   {/* <Navbar/> */}

    <div className="m-5 flex flex-col lg:flex-row gap-5">
    {/* Sidebar */}
    <Sidebar />
  
    <div className="flex-1">
      {/* Statistics Section */}
      <div className="flex flex-wrap gap-6 justify-center lg:justify-start mb-8">
        {[
          { label: "Doctors", value: dashData.doctors, icon: assets.doctor_icon },
          { label: "Appointments", value: dashData.appointments, icon: assets.appointments_icon },
          { label: "Patients", value: dashData.patients, icon: assets.patients_icon },
        ].map((data, index) => (
          <div
            key={index}
            className="flex items-center gap-2 bg-white p-4 w-60 rounded-lg shadow-md border-2 border-gray-100 cursor-pointer hover:scale-105 transition-all"
          >
            <img className="w-14" src={data.icon} alt="" />
            <div>
              <p className="text-xl font-semibold text-gray-600">{data.value}</p>
              <p className="text-gray-400">{data.label}</p>
            </div>
          </div>
        ))}
      </div>
  
      {/* Latest Bookings Section */}
      <div className="bg-white rounded-lg shadow-lg">
        <div className="flex items-center gap-2.5 px-4 py-4 rounded-t border-b">
          <img src={assets.list_icon} alt="" />
          <p className="font-semibold">Latest Bookings</p>
        </div>
  
        <div className="pt-4">
          {dashData.latestAppointments.slice(0, 5).map((item, index) => (
            <div
              className="flex items-center px-6 py-3 gap-3 hover:bg-gray-100 border-b last:border-none"
              key={index}
            >
              <img className="rounded-full w-10" src={item.docData.image} alt="" />
              <div className="flex-1 text-sm">
                <p className="text-gray-800 font-medium">{item.docData.name}</p>
                <p className="text-gray-600">Booking on {slotDateFormat(item.slotDate)}</p>
              </div>
              {item.cancelled ? (
                <p className="text-red-400 text-xs font-medium">Cancelled</p>
              ) : item.isCompleted ? (
                <p className="text-green-500 text-xs font-medium">Completed</p>
              ) : (
                <img
                  onClick={() => cancelAppointment(item._id)}
                  className="w-10 cursor-pointer"
                  src={assets.cancel_icon}
                  alt=""
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  </div>
   </>
  
  )
}

export default Dashboard