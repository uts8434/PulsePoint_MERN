import React, { useContext } from 'react';
import { assets } from '../assets/assets';
import { DoctorContext } from '../context/DoctorContext';
import { AdminContext } from '../context/AdminContext';
import { useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const { dToken, setDToken } = useContext(DoctorContext);
  const { aToken, setAToken } = useContext(AdminContext);
  const navigate = useNavigate();

  const logout = () => {
    navigate('/');
    if (dToken) {
      setDToken('');
      localStorage.removeItem('dToken');
    }
    if (aToken) {
      setAToken('');
      localStorage.removeItem('aToken');
    }
  };

  return (
    <div className="flex justify-between items-center px-6 sm:px-12 py-1 border-b bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-500 shadow-md">
      <div className="flex items-center gap-3 text-sm text-white">
        <img
          onClick={() => navigate('/')}
          className="w-10 sm:w-20 cursor-pointer"
          src={assets.admin_logo}
          alt="Admin Logo"
        />
        <p className="bg-white text-gray-800 px-3 py-1 rounded-full shadow-sm">
          {aToken ? 'Admin' : 'Doctor'}
        </p>
      </div>
      <button
        onClick={logout}
        className="bg-white text-blue-700 text-sm px-8 py-2 rounded-full shadow-md hover:bg-blue-100 transition-all duration-200"
      >
        Logout
      </button>
    </div>
  );
};

export default AdminNavbar;
