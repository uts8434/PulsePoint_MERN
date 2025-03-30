import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
const TopDoctors = () => {
  const navigate = useNavigate();

  const { doctors } = useContext(AppContext);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-gray-800 md:mx-10">
      <h1 className="text-3xl font-semibold text-purple-800">
        Top Doctors to Book
      </h1>
      <p className="sm:w-1/2 text-center text-gray-600 text-sm">
        Simply browse through our extensive list of trusted doctors and book
        your appointment with ease.
      </p>

      <div className="w-full flex flex-wrap justify-start gap-8 pt-8 px-4 sm:px-0">
  {doctors.slice(0, 10).map((item, index) => (
    <div
      key={index}
      onClick={() => {
        document.body.style.transition = "opacity 0.3s ease-in-out"; // Smooth fade effect
        document.body.style.opacity = 0;
        setTimeout(() => {
          navigate(`/appointment/${item._id}`);
          scrollTo(0, 0);
          document.body.style.opacity = 1;
        }, 300); // Adjust this delay to match animation duration
      }}
      className="border flex flex-col border-gray-200 bg-white rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-transform duration-300 cursor-pointer w-[90%] sm:w-64 md:w-60 lg:w-56"
    >
      {/* Image with Circular Gradient Border */}
      <div className="p-4 flex justify-center">
        <div className="p-[2px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-purple-500">
          <img
            className="w-16 h-16 rounded-full object-cover border-2 border-white"
            src={item.image}
            alt={item.name}
          />
        </div>
      </div>

      {/* Info Section */}
      <div className="px-4 pb-4 flex flex-col items-center text-center space-y-2">
        {/* Availability */}
        <div
          className={`flex items-center gap-2 text-sm font-medium ${
            item.available ? "text-green-600" : "text-red-600"
          }`}
        >
          <span
            className={`w-3 h-3 rounded-full ${
              item.available ? "bg-green-500" : "bg-red-500"
            }`}
          ></span>
          <p>{item.available ? "Available" : "Not Available"}</p>
        </div>

        {/* Name and Speciality */}
        <p className="text-lg font-semibold text-gray-900">{item.name.toUpperCase()}</p>
        <p className="text-sm text-gray-600">
          {item.speciality.charAt(0).toUpperCase() + item.speciality.slice(1)}
        </p>

        {/* View Profile Button */}
        <button className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-2 rounded-full text-sm hover:scale-110 hover:shadow-md transition-all duration-300">
          View Profile
        </button>
      </div>
    </div>
  ))}
</div>


      <button
        onClick={() => {
          navigate("/doctors");
          scrollTo(0, 0);
        }}
        className="bg-gradient-to-r from-pink-400 to-orange-500 text-white px-12 py-3 rounded-full mt-10 shadow-lg hover:shadow-xl hover:scale-105 transition-transform duration-300"
      >
        More
      </button>
    </div>
  );
};

export default TopDoctors;
