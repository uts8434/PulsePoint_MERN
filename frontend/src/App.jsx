import React from 'react'
import Navbar from './components/Navbar'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Doctors from './pages/Doctors'
import Login from './pages/Login'
import About from './pages/About'
import Contact from './pages/Contact'
import Appointment from './pages/Appointment'
import MyAppointments from './pages/MyAppointments'
import MyProfile from './pages/MyProfile'
import Footer from './components/Footer'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Verify from './pages/Verify'
import AdminLogin from "./Admin/pages/AdminLogin";
import Dashboard from "./Admin/pages/Admin/Dashboard";
import DoctorDashboard from "./Admin/pages/Doctor/DoctorDashboard";
import AllAppointments from "./Admin/pages/Admin/AllAppointments"
import AddDoctor from "./Admin/pages/Admin/AddDoctor"
import DoctorsList from "./Admin/pages/Admin/DoctorsList"
import Forgot_Pass from "./Admin/pages/Doctor/Forgot_Pass"
import DoctorAppointments from "./Admin/pages/Doctor/DoctorAppointments"
 import DoctorProfile from "./Admin/pages/Doctor/DoctorProfile"
 import UserForgotPass from './pages/UserForgotPass'
import Success from './pages/Success'

const App = () => {
  return (
    <div className='mx-4 sm:mx-[10%]'>
      <ToastContainer />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/doctors' element={<Doctors />} />
        <Route path='/doctors/:speciality' element={<Doctors />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/appointment/:docId' element={<Appointment />} />
        <Route path='/my-appointments' element={<MyAppointments />} />
        <Route path='/my-profile' element={<MyProfile />} />
        <Route path='/verify' element={<Verify />} />
        <Route path='/User-forgot-password' element={<UserForgotPass />} />


        <Route path='/admin/admin_login' element={<AdminLogin />} />
        <Route path='/admin/dashboard' element={<Dashboard />} />
        <Route path='/admin/all-appointments' element={<AllAppointments />} />
        <Route path='/admin/add-doctor' element={<AddDoctor />} />
        <Route path='/admin/doctor-list' element={<DoctorsList />} />
        



        <Route path='/doctor/dashboard' element={<DoctorDashboard />} />
        <Route path='/doctor/forgot-password' element={<Forgot_Pass />} />
        <Route path='/doctor/doctor-appointments' element={<DoctorAppointments />} />
        <Route path='/doctor/doctor-profile' element={<DoctorProfile />} />
        <Route path='/success' element={<Success />} />


      </Routes>
      <Footer />
    </div>
  )
}

export default App