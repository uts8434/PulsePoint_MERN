import React, { useContext, useState, useEffect } from "react";
import { assets } from "../assets/assets";
import { NavLink, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import AdminNavbar from "../Admin/components/AdminNavbar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes, faUser, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";

const Navbar = () => {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const { token, setToken, userData } = useContext(AppContext);

  const adminToken = localStorage.getItem("aToken");
  const doctoken = localStorage.getItem("dToken");
  const isAdmin = userData?.role === "admin";
  const showNav = Boolean(adminToken || doctoken);

  const logout = () => {
    localStorage.removeItem("token");
    setToken(false);
    navigate("/login");
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (!event.target.closest(".dropdown-container")) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  if (!showNav) {
    return (
      <div className="flex items-center justify-between text-sm py-4 mb-5 border-b border-b-purple-300 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 shadow-lg px-6">
        {/* Logo */}
        <img
          onClick={() => navigate("/")}
          className="w-16 cursor-pointer"
          src={assets.logo}
          alt="Site Logo"
        />

        {/* Desktop Navigation */}
        <ul className="md:flex items-center gap-6 font-medium hidden">
          {isAdmin ? (
            <NavLink to="/admin/dashboard">
              <li className="px-4 py-1 hover:bg-purple-700 hover:text-white rounded-lg transition-all duration-200">
                Admin Dashboard
              </li>
            </NavLink>
          ) : (
            <>
              {["/", "/doctors", "/about", "/contact"].map((path, i) => (
                <NavLink
                  key={i}
                  to={path}
                  className={({ isActive }) =>
                    isActive ? "text-orange-300 font-semibold" : "text-gray-200"
                  }
                  onClick={() => setShowMenu(false)} // Close menu on click
                >
                  <li className="px-4 py-1 hover:bg-purple-700 hover:text-white rounded-lg transition-all duration-200">
                    {["HOME", "ALL DOCTORS", "ABOUT", "CONTACT"][i]}
                  </li>
                </NavLink>
              ))}
              <NavLink to="/admin/admin_login" onClick={() => setShowMenu(false)}>
                <li className="px-4 py-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all">
                  Admin Login
                </li>
              </NavLink>
            </>
          )}
        </ul>

        {/* Right Section (User/Profile + Hamburger Menu) */}
        <div className="flex items-center gap-4">
          {/* User Dropdown */}
          {token && userData ? (
            <div
              className="flex items-center gap-2 cursor-pointer relative dropdown-container"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <div className="p-1 rounded-full bg-gradient-to-tr from-purple-200 to-purple-300">
                <img
                  className="w-10 h-10 rounded-full object-cover"
                  src={userData.image}
                  alt="User Profile"
                />
              </div>

              {showDropdown && (
                <div className="absolute top-12 right-0 text-base font-medium text-purple-700 z-20">
                  <div className="min-w-48 bg-white shadow-lg rounded flex flex-col gap-2 p-4">
                    <p
                      onClick={() => {
                        navigate("/my-profile");
                        setShowDropdown(false);
                      }}
                      className="hover:text-purple-500 cursor-pointer flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faUser} />
                      My Profile
                    </p>
                    <p
                      onClick={() => {
                        navigate("/my-appointments");
                        setShowDropdown(false);
                      }}
                      className="hover:text-purple-500 cursor-pointer flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faUser} />
                      My Appointments
                    </p>
                    <p
                      onClick={() => {
                        logout();
                        setShowDropdown(false);
                      }}
                      className="hover:text-red-900 text-red-600 cursor-pointer flex items-center gap-2"
                    >
                      <FontAwesomeIcon icon={faSignOutAlt} />
                      Logout
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-gradient-to-r from-pink-400 to-orange-500 text-white px-10 py-3 rounded-full font-medium hidden md:block transition-all shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Sign Up / Login
            </button>
          )}

          {/* Hamburger Menu (Mobile Only) */}
          <button
            className="md:hidden text-white text-2xl"
            onClick={() => setShowMenu(!showMenu)}
          >
            <FontAwesomeIcon icon={showMenu ? faTimes : faBars} />
          </button>
        </div>

        
        {showMenu && (
          <div className="absolute top-24 left-4 right-4   h-screen bg-purple-600 text-white shadow-lg rounded-b-2xl flex flex-col items-center py-4 md:hidden z-50 transition-all duration-300">
            {["/", "/doctors", "/about", "/contact","/login"].map((path, i) => (
              <NavLink 
                key={i} 
                to={path} 
                onClick={() => setShowMenu(false)}
                className={({ isActive }) =>
                  `py-3 px-6 w-full text-center rounded-lg transition-all duration-200 ${
                    isActive ? " text-orange-600 font-semibold" : ""
                  }`
                }
              >
                {["HOME", "ALL DOCTORS", "ABOUT", "CONTACT","Sign Up/ Login"][i]}
              </NavLink>
            ))}
            <NavLink 
              to="/admin/admin_login" 
              onClick={() => setShowMenu(false)}
              className="py-3 px-6 w-full text-center bg-gradient-to-r from-pink-500 to-orange-500 text-white font-semibold rounded-lg mt-2 hover:shadow-lg transition-all duration-200"
            >
              Admin Login
            </NavLink>
          </div>
        )}

      </div>
    );
  }

  return <AdminNavbar />;
};

export default Navbar;
