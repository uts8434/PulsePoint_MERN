import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { assets } from "../assets/assets";
import RelatedDoctors from "../components/RelatedDoctors";
import axios from "axios";
import { toast } from "react-toastify";

const Appointment = () => {
  const { docId } = useParams();
  const { doctors, currencySymbol, backendUrl, token, getDoctosData } =
    useContext(AppContext);
  const daysOfWeek = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];

  const [docInfo, setDocInfo] = useState(false);
  const [docSlots, setDocSlots] = useState([]);
  const [slotIndex, setSlotIndex] = useState(0);
  const [slotTime, setSlotTime] = useState("");

  const navigate = useNavigate();

  const fetchDocInfo = async () => {
    const docInfo = doctors.find((doc) => doc._id === docId);
    setDocInfo(docInfo);
  };

  const getAvailableSolts = async () => {
    setDocSlots([]);

    // getting current date
    let today = new Date();

    for (let i = 0; i < 7; i++) {
      // getting date with index
      let currentDate = new Date(today);
      currentDate.setDate(today.getDate() + i);

      // setting end time of the date with index
      let endTime = new Date();
      endTime.setDate(today.getDate() + i);
      endTime.setHours(21, 0, 0, 0);

      // setting hours
      if (today.getDate() === currentDate.getDate()) {
        currentDate.setHours(
          currentDate.getHours() > 10 ? currentDate.getHours() + 1 : 10
        );
        currentDate.setMinutes(currentDate.getMinutes() > 30 ? 30 : 0);
      } else {
        currentDate.setHours(10);
        currentDate.setMinutes(0);
      }

      let timeSlots = [];

      while (currentDate < endTime) {
        let formattedTime = currentDate.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        });

        let day = currentDate.getDate();
        let month = currentDate.getMonth() + 1;
        let year = currentDate.getFullYear();

        const slotDate = day + "_" + month + "_" + year;
        const slotTime = formattedTime;

        const isSlotAvailable =
          docInfo.slots_booked[slotDate] &&
          docInfo.slots_booked[slotDate].includes(slotTime)
            ? false
            : true;

        if (isSlotAvailable) {
          // Add slot to array
          timeSlots.push({
            datetime: new Date(currentDate),
            time: formattedTime,
          });
        }

        // Increment current time by 30 minutes
        currentDate.setMinutes(currentDate.getMinutes() + 30);
      }

      setDocSlots((prev) => [...prev, timeSlots]);
    }
  };

  const bookAppointment = async () => {
    if (!token) {
      toast.warning("Login to book appointment");
      return navigate("/login");
    }

    const date = docSlots[slotIndex][0].datetime;

    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();

    const slotDate = day + "_" + month + "_" + year;

    try {
      const { data } = await axios.post(
        backendUrl + "/api/user/book-appointment",
        { docId, slotDate, slotTime },
        { headers: { token } }
      );
      if (data.success) {
        toast.success(data.message);
        getDoctosData();
        navigate("/my-appointments");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  useEffect(() => {
    if (doctors.length > 0) {
      fetchDocInfo();
    }
  }, [doctors, docId]);

  useEffect(() => {
    if (docInfo) {
      getAvailableSolts();
    }
  }, [docInfo]);

  return docInfo ? (
    <div className="p-6 sm:p-8 bg-blue-50 rounded-lg animate-fade-in">
      {/* Doctor Details Section */}
      <div className="flex flex-col sm:flex-row gap-6  bg-white p-6 rounded-2xl shadow-md hover:shadow-xl transition-shadow duration-300">
        {/* Doctor Image with Gradient Border */}
        <div className="flex-shrink-0">
          <div className="p-[3px] rounded-full bg-gradient-to-tr from-purple-500 via-pink-500 to-purple-500">
            <img
              className="w-40 sm:w-[280px] h-40 sm:h-[280px] object-cover rounded-full border-4 border-white"
              src={docInfo.image}
              alt={`${docInfo.name}'s photo`}
            />
          </div>
        </div>

        {/* Doctor Info Card */}
        <div className="flex-1 bg-gradient-to-r  from-blue-50 to-blue-100 border border-blue-300 rounded-xl p-6">
          {/* Doctor Name */}
          <p className="flex items-center gap-2 text-2xl sm:text-3xl font-bold text-blue-800">
            {docInfo.name.toUpperCase()}
            <img className="w-5" src={assets.verified_icon} alt="Verified" />
          </p>

          {/* Degree, Speciality, and Experience */}
          <div className="flex items-center flex-wrap gap-2 mt-2 text-blue-600 text-sm sm:text-base">
            <p>
              {docInfo.degree.toUpperCase()} -{" "}
              {docInfo.speciality.toUpperCase()}
            </p>
            <span className="bg-yellow-500 text-white text-xs px-2 py-0.5 rounded-full">
              {docInfo.experience} Years Experience
            </span>
          </div>

          {/* About Section */}
          <p className="mt-4 text-blue-700 font-medium">About</p>
          <p className="text-sm text-gray-700 mt-2 leading-relaxed">
            {docInfo.about}
          </p>

          {/* Fees Section */}
          <p className="mt-4 text-blue-700 font-medium">
            Appointment fee:{" "}
            <span className="text-blue-900">
              {currencySymbol}
              {docInfo.fees}
            </span>
          </p>
        </div>
      </div>

      {/* Booking Slots Section */}
      <div className="mt-8">
        <p className="text-lg font-bold text-blue-800">Booking Slots</p>

        {/* Slot Dates */}
        <div className="flex gap-4 py-8 overflow-x-auto mt-2">
          {docSlots.length > 0 ? (
            docSlots.map((item, index) => (
              <div
                key={index}
                onClick={() => setSlotIndex(index)}
                className={`py-4 px-6 text-center rounded-xl cursor-pointer shadow-md transition-all transform hover:scale-105 ${
                  slotIndex === index
                    ? "bg-purple-700 text-white shadow-lg"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                }`}
              >
                <p className="text-sm">
                  {item[0] && daysOfWeek[item[0].datetime.getDay()]}
                </p>
                <p className="text-lg font-semibold">
                  {item[0] && item[0].datetime.getDate()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500 mt-2">No slots available</p>
          )}
        </div>

        {/* Slot Times */}
        <div className="flex gap-3 py-6 px-4 overflow-x-auto mt-2">
          {docSlots.length > 0 && docSlots[slotIndex].length > 0 ? (
            docSlots[slotIndex].map((item, index) => (
              <p
                key={index}
                onClick={() => setSlotTime(item.time)}
                className={`px-4 py-2 rounded-lg cursor-pointer text-sm transition-all transform hover:scale-110 ${
                  item.time === slotTime
                    ? "bg-purple-700 text-white shadow-md"
                    : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                }`}
              >
                {item.time.toLowerCase()}
              </p>
            ))
          ) : (
            <p className="text-gray-500">No times available</p>
          )}
        </div>

        {/* Book Appointment Button */}
        <button
          onClick={bookAppointment}
          disabled={!slotTime}
          className={`mt-6 px-8 py-3 rounded-lg text-white text-sm font-medium transition-all transform hover:scale-105 ${
            slotTime
              ? "bg-purple-800 hover:bg-purple-600"
              : "bg-gray-400 cursor-not-allowed"
          }`}
        >
          {slotTime ? "Book an Appointment" : "Select a slot to book"}
        </button>
      </div>

      {/* Related Doctors Section */}
      <RelatedDoctors speciality={docInfo.speciality} docId={docId} />
    </div>
  ) : null;
};

export default Appointment;
