import React, { useContext, useEffect } from "react";
import { AdminContext } from "../../context/AdminContext";
import Sidebar from "../../components/Sidebar";
import Navbar from "../../components/AdminNavbar";

const DoctorsList = () => {
  const { doctors, changeAvailability, aToken, getAllDoctors } =
    useContext(AdminContext);

  useEffect(() => {
    if (aToken) {
      getAllDoctors();
    }
  }, [aToken]);

  return (
    <>
      {/* <Navbar /> */}
      <div className="w-full flex">
        <Sidebar />
        <div className="flex-1 m-5 max-h-[90vh] overflow-y-scroll">
          <h1 className="text-lg font-medium mb-5">All Doctors</h1>

          <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {doctors.map((item, index) => (
              <div
                className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow duration-300"
                key={index}
              >
                <img
                  className="bg-[#EAEFFF] w-full h-40 object-cover 
                             group-hover:bg-gradient-to-r group-hover:from-blue-500 group-hover:to-purple-500 
                             transition-all duration-500"
                  src={item.image}
                  alt={item.name}
                />
                <div className="p-4">
                  <p className="text-[#262626] text-lg font-medium">
                    {item.name}
                  </p>
                  <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>

                  <div className="mt-2 flex items-center gap-2 text-sm">
                    <input
                      onChange={() => changeAvailability(item._id)}
                      type="checkbox"
                      checked={item.available}
                      className="cursor-pointer"
                    />
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default DoctorsList;
