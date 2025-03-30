import React, { useContext, useEffect, useState } from 'react'
import { DoctorContext } from '../../context/DoctorContext'
import { AppContext } from '../../context/AdminAppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Sidebar from '../../components/Sidebar'
import Navbar from '../../components/AdminNavbar'

const DoctorProfile = () => {

    const { dToken, profileData, setProfileData, getProfileData } = useContext(DoctorContext)
    const { currency, backendUrl } = useContext(AppContext)
    const [isEdit, setIsEdit] = useState(false)

    const updateProfile = async () => {

        try {

            const updateData = {
                address: profileData.address,
                fees: profileData.fees,
                about: profileData.about,
                available: profileData.available
            }

            const { data } = await axios.post(backendUrl + '/api/doctor/update-profile', updateData, { headers: { dToken } })

            if (data.success) {
                toast.success(data.message)
                setIsEdit(false)
                getProfileData()
            } else {
                toast.error(data.message)
            }

            setIsEdit(false)

        } catch (error) {
            toast.error(error.message)
            console.log(error)
        }

    }

    useEffect(() => {
        if (dToken) {
            getProfileData()
        }
    }, [dToken])

    return profileData && (
        <>
          {/* <Navbar />  */}
          <div className="flex">
            <Sidebar />
      
            <div className="flex flex-col gap-4 p-5 w-full">
              <div className="flex flex-col sm:flex-row gap-5">
                <img
                  className="bg-primary/80 w-full sm:max-w-sm rounded-lg object-cover"
                  src={profileData.image}
                  alt="Doctor Profile"
                />
      
                <div className="flex-1 border border-stone-100 rounded-lg p-8 bg-white">
                  {/* Doctor Info: Name, Degree, Experience */}
                  <p className="flex items-center gap-2 text-3xl font-medium text-gray-700">
                    {profileData.name}
                  </p>
                  <div className="flex items-center gap-2 mt-1 text-gray-600">
                    <p>{profileData.degree} - {profileData.speciality}</p>
                    <button className="py-0.5 px-2 border text-xs rounded-full">
                      {profileData.experience}
                    </button>
                  </div>
      
                  {/* Doctor About Section */}
                  <div className="mt-3">
                    <p className="text-sm font-medium text-[#262626]">About:</p>
                    <p className="text-sm text-gray-600 mt-1">
                      {isEdit ? (
                        <textarea
                          onChange={(e) => setProfileData(prev => ({ ...prev, about: e.target.value }))}
                          className="w-full outline-primary p-2 rounded border"
                          rows={8}
                          value={profileData.about}
                        />
                      ) : (
                        profileData.about
                      )}
                    </p>
                  </div>
      
                  <p className="text-gray-600 font-medium mt-4">
                    Appointment fee:{" "}
                    <span className="text-gray-800">
                      {currency}{" "}
                      {isEdit ? (
                        <input
                          type="number"
                          onChange={(e) =>
                            setProfileData(prev => ({ ...prev, fees: e.target.value }))
                          }
                          className="p-1 border rounded"
                          value={profileData.fees}
                        />
                      ) : (
                        profileData.fees
                      )}
                    </span>
                  </p>
      
                  <div className="flex flex-col mt-4">
                    <p className="font-medium">Address:</p>
                    {isEdit ? (
                      <div className="flex flex-col gap-2">
                        <input
                          type="text"
                          onChange={(e) =>
                            setProfileData(prev => ({
                              ...prev,
                              address: { ...prev.address, line1: e.target.value },
                            }))
                          }
                          className="p-1 border rounded"
                          value={profileData.address.line1}
                        />
                        <input
                          type="text"
                          onChange={(e) =>
                            setProfileData(prev => ({
                              ...prev,
                              address: { ...prev.address, line2: e.target.value },
                            }))
                          }
                          className="p-1 border rounded"
                          value={profileData.address.line2}
                        />
                      </div>
                    ) : (
                      <p className="text-sm">
                        {profileData.address.line1}
                        <br />
                        {profileData.address.line2}
                      </p>
                    )}
                  </div>
      
                  <div className="flex items-center gap-2 pt-2">
                    <input
                      type="checkbox"
                      onChange={() => isEdit && setProfileData(prev => ({ ...prev, available: !prev.available }))}
                      checked={profileData.available}
                    />
                    <label htmlFor="">Available</label>
                  </div>
      
                  <div className="mt-5">
                    {isEdit ? (
                      <button
                        onClick={updateProfile}
                        className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                      >
                        Save
                      </button>
                    ) : (
                      <button
                        onClick={() => setIsEdit(prev => !prev)}
                        className="px-4 py-1 border border-primary text-sm rounded-full hover:bg-primary hover:text-white transition-all"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </>
      );
      
}

export default DoctorProfile