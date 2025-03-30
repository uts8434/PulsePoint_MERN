import React from 'react'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <div className="bg-gray-200 py-4 px-4 mb-8 rounded">
  {/* About Us Section */}
  <div className="text-center text-3xl font-medium pt-10 text-gray-600">
    <p>ABOUT <span className="text-gray-800 font-bold">US</span></p>
  </div>

  <div className="my-12 flex flex-col md:flex-row gap-12 items-center">
    <img className="w-full md:max-w-[360px] rounded-lg shadow-lg" src={assets.about_image} alt="About Us" />
    <div className="flex flex-col justify-center gap-6 md:w-2/4 text-base text-gray-700 leading-relaxed">
      <p>Welcome to <span className="font-semibold text-indigo-700">LifehealthCare</span>, your trusted partner in managing your healthcare needs conveniently and efficiently. At LifehealthCare, we understand the challenges individuals face when it comes to scheduling doctor appointments and managing their health records.</p>
      <p>LifehealthCare is committed to excellence in healthcare technology. We continuously strive to enhance our platform, integrating the latest advancements to improve user experience and deliver superior service. Whether you're booking your first appointment or managing ongoing care, LifehealthCare is here to support you every step of the way.</p>
      <b className="text-xl text-gray-900">Our Vision</b>
      <p>Our vision at <span className="font-semibold text-indigo-700">LifehealthCare</span> is to create a seamless healthcare experience for every user. We aim to bridge the gap between patients and healthcare providers, making it easier for you to access the care you need, when you need it.</p>
    </div>
  </div>

  {/* Why Choose Us Section */}
  <div className="text-center text-2xl font-medium my-8">
    <p>WHY <span className="text-gray-800 font-bold">CHOOSE US</span></p>
  </div>

  <div className="flex flex-col md:flex-row justify-center mb-20 gap-6">
    {/* Card 1 */}
    <div className="border border-gray-300 bg-white rounded-lg px-10 md:px-16 py-10 flex flex-col gap-5 text-[15px] text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
      <b className="text-lg">EFFICIENCY:</b>
      <p>Streamlined appointment scheduling that fits into your busy lifestyle.</p>
    </div>

    {/* Card 2 */}
    <div className="border border-gray-300 bg-white rounded-lg px-10 md:px-16 py-10 flex flex-col gap-5 text-[15px] text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
      <b className="text-lg">CONVENIENCE:</b>
      <p>Access to a network of trusted healthcare professionals in your area.</p>
    </div>

    {/* Card 3 */}
    <div className="border border-gray-300 bg-white rounded-lg px-10 md:px-16 py-10 flex flex-col gap-5 text-[15px] text-gray-700 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-600 hover:text-white hover:shadow-lg transition-all duration-300 cursor-pointer">
      <b className="text-lg">PERSONALIZATION:</b>
      <p>Tailored recommendations and reminders to help you stay on top of your health.</p>
    </div>
  </div>
</div>

  )
}

export default About
