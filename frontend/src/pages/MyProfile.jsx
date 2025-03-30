import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { assets } from "../assets/assets";

const MyProfile = () => {
  const [isEdit, setIsEdit] = useState(false);

  const [image, setImage] = useState(false);

  const { token, backendUrl, userData, setUserData, loadUserProfileData } =
    useContext(AppContext);

  // Function to update user profile data using API
  const updateUserProfileData = async () => {
    try {
      const formData = new FormData();

      formData.append("name", userData.name);
      formData.append("phone", userData.phone);
      formData.append("address", JSON.stringify(userData.address));
      formData.append("gender", userData.gender);
      formData.append("dob", userData.dob);

      image && formData.append("image", image);

      const { data } = await axios.post(
        backendUrl + "/api/user/update-profile",
        formData,
        { headers: { token } }
      );

      if (data.success) {
        toast.success(data.message);
        await loadUserProfileData();
        setIsEdit(false);
        setImage(false);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.message);
    }
  };

  return userData ? (
    <div className="min-h-screen flex items-center rounded-2xl mb-8 justify-center bg-gradient-to-br from-purple-100 via-purple-200 to-purple-300 ">
  <div className="max-w-lg w-full bg-white rounded-2xl shadow-2xl p-10 flex flex-col gap-8 text-sm mt-20 mb-10">

    {isEdit ? (
      <label htmlFor="image">
        <div className="relative w-40 h-40 rounded-full cursor-pointer mx-auto shadow-lg hover:scale-105 transition-transform">
          <img
            className="w-full h-full object-cover rounded-full opacity-90"
            src={image ? URL.createObjectURL(image) : userData.image}
            alt=""
          />
          {!image && (
            <img
              className="absolute bottom-2 right-2 w-10"
              src={assets.upload_icon}
              alt=""
            />
          )}
        </div>
        <input
          onChange={(e) => setImage(e.target.files[0])}
          type="file"
          id="image"
          hidden
        />
      </label>
    ) : (
      <img
        className="w-20  rounded-full mx-auto shadow-lg"
        src={userData.image}
        alt=""
      />
    )}

    {isEdit ? (
      <input
        className="bg-purple-50 text-3xl font-medium w-full text-center rounded-lg py-1 border border-purple-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-transparent transition-all"
        type="text"
        onChange={(e) =>
          setUserData((prev) => ({ ...prev, name: e.target.value }))
        }
        value={userData.name}
      />
    ) : (
      <p className="font-bold text-3xl text-center text-purple-800 mt-2">
        {userData.name}
      </p>
    )}

    <hr className="bg-purple-400 h-[1px] border-none my-0" />

    <div>
      <p className="text-purple-700 underline mb-3 text-lg font-semibold">Contact Information</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-4 gap-x-2 text-gray-700">
        <p className="font-medium">Email id:</p>
        <p className="text-purple-600">{userData.email}</p>

        <p className="font-medium">Phone:</p>
        {isEdit ? (
          <input
            className="bg-purple-50 w-full rounded-lg p-2 border border-purple-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            type="text"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, phone: e.target.value }))
            }
            value={userData.phone}
          />
        ) : (
          <p className="text-purple-600">{userData.phone}</p>
        )}

        <p className="font-medium">Address:</p>
        {isEdit ? (
          <div className="flex flex-col gap-2">
            <input
              className="bg-purple-50 rounded-lg p-2 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line1: e.target.value },
                }))
              }
              value={userData.address.line1}
            />
            <input
              className="bg-purple-50 rounded-lg p-2 border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              type="text"
              onChange={(e) =>
                setUserData((prev) => ({
                  ...prev,
                  address: { ...prev.address, line2: e.target.value },
                }))
              }
              value={userData.address.line2}
            />
          </div>
        ) : (
          <p className="text-gray-500">
            {userData.address.line1} <br /> {userData.address.line2}
          </p>
        )}
      </div>
    </div>

    <div className="mt-6">
      <p className="text-purple-700 underline mb-3 text-lg font-semibold">Basic Information</p>
      <div className="grid grid-cols-[1fr_3fr] gap-y-4 gap-x-2 text-gray-700">
        <p className="font-medium">Gender:</p>
        {isEdit ? (
          <select
            className="w-full rounded-lg bg-purple-50 p-2 border border-purple-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, gender: e.target.value }))
            }
            value={userData.gender}
          >
            <option value="Not Selected">Not Selected</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        ) : (
          <p className="text-gray-500">{userData.gender}</p>
        )}

        <p className="font-medium">Birthday:</p>
        {isEdit ? (
          <input
            className="w-full bg-purple-50 rounded-lg p-2 border border-purple-200 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
            type="date"
            onChange={(e) =>
              setUserData((prev) => ({ ...prev, dob: e.target.value }))
            }
            value={userData.dob}
          />
        ) : (
          <p className="text-gray-500">{userData.dob}</p>
        )}
      </div>
    </div>

    <div className="mt-10 text-center">
      {isEdit ? (
        <button
          onClick={updateUserProfileData}
          className="bg-purple-700 text-white px-8 py-3 rounded-full hover:bg-purple-800 shadow-md hover:shadow-lg transition-all"
        >
          Save Information
        </button>
      ) : (
        <button
          onClick={() => setIsEdit(true)}
          className="bg-purple-700 text-white px-8 py-3 rounded-full hover:bg-purple-800 shadow-md hover:shadow-lg transition-all"
        >
          Edit
        </button>
      )}
    </div>
  </div>
</div>

  ) : null;
};

export default MyProfile;
