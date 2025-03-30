import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate, useParams } from "react-router-dom";

const Doctors = () => {
  const { speciality } = useParams();
  const [filterDoc, setFilterDoc] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();
  const { doctors } = useContext(AppContext);

  const applyFilter = () => {
    if (speciality) {
      setFilterDoc(doctors.filter((doc) => doc.speciality === speciality));
    } else {
      setFilterDoc(doctors);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [doctors, speciality]);

  const specialities = [
    "General physician",
    "Gynecologist",
    "Dermatologist",
    "Pediatricians",
    "Neurologist",
    "Gastroenterologist",
  ];

  return (
    <div className="p-6 mb-7 rounded sm:p-10 bg-gradient-to-r from-purple-50 via-purple-100 to-purple-50 ">
      <p className="text-purple-700 text-xl font-semibold">
        Explore Specialist Doctors:
      </p>

      <div className="flex flex-col sm:flex-row items-start gap-6 mt-6">
        {/* Toggle Filter Button for Smaller Screens */}
        <button
          onClick={() => setShowFilter(!showFilter)}
          className={`py-2 px-4 rounded-full text-sm font-medium transition-all sm:hidden border-2 shadow-sm ${
            showFilter
              ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700"
              : "text-purple-600 border-purple-600 hover:bg-purple-100"
          }`}
        >
          {showFilter ? "Hide Filters" : "Show Filters"}
        </button>

        {/* Filter Options */}
        <div
  className={`flex flex-col gap-4 text-sm font-medium text-purple-600 ${
    showFilter ? "flex" : "hidden sm:flex"
  }`}
>
  {specialities.map((specialityName) => (
    <p
      key={specialityName}
      onClick={() =>
        speciality === specialityName
          ? navigate("/doctors")
          : navigate(`/doctors/${specialityName}`)
      }
      className={`w-full sm:w-auto px-4 py-2 rounded-lg cursor-pointer shadow hover:shadow-lg transition-all transform hover:scale-105 ${
        speciality === specialityName
          ? "bg-purple-100 text-purple-800 border border-purple-300"
          : "bg-white border border-gray-300 hover:bg-purple-50"
      }`}
    >
      {specialityName}
    </p>
  ))}
</div>


        {/* Doctor Cards Grid */}
        <div className="w-full flex flex-wrap gap-6">
          {filterDoc.length > 0 ? (
            filterDoc.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  navigate(`/appointment/${item._id}`);
                  scrollTo(0, 0);
                }}
                className="w-full sm:w-[48%] lg:w-[31%] border flex items-center border-purple-300 rounded-2xl overflow-hidden cursor-pointer hover:-translate-y-2 transition-transform duration-300 shadow-lg hover:shadow-2xl bg-white p-4 gap-4"
              >
                {/* Doctor Image */}
                <div className="w-16 flex-shrink-0">
                  <img
                    className="w-full rounded-full border-2 border-purple-500"
                    src={item.image}
                    alt={item.name}
                  />
                </div>

                {/* Doctor Details */}
                <div className="flex flex-col">
                  <div
                    className={`flex items-center gap-2 text-sm ${
                      item.available ? "text-green-600" : "text-gray-500"
                    }`}
                  >
                    <span
                      className={`w-3 h-3 rounded-full ${
                        item.available ? "bg-green-500" : "bg-gray-500"
                      }`}
                    ></span>
                    <p>{item.available ? "Available" : "Not Available"}</p>
                  </div>

                  <p className="text-purple-800 text-lg font-bold mt-1">
                    {item.name.toUpperCase()}
                  </p>
                  <p className="text-gray-600 text-sm">
                    {item.speciality.charAt(0).toUpperCase() +
                      item.speciality.slice(1)}
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p className="text-purple-500 text-lg w-full text-center mt-10">
              No doctors available for the selected category.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Doctors;
