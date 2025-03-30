import React from 'react';
import { assets } from '../assets/assets';

const Contact = () => {
  return (
    <div className="bg-gray-200 py-12 px-4 sm:px-8 mb-4 rounded">

      {/* Header Section */}
      <div className="text-center text-3xl font-medium pt-10 text-gray-600">
        <p className='text-purple-500'>CONTACT &nbsp; <span className="text-orange-500 ">US</span></p>
      </div>

      {/* Contact Information */}
      <div className="my-12 flex flex-col justify-center md:flex-row gap-10 items-center text-sm">
        <img 
          className="w-full md:max-w-[360px] rounded-lg shadow-lg" 
          src={assets.contact_image} 
          alt="Contact Us" 
        />
        <div className="flex flex-col justify-center items-start gap-6 text-gray-700">

          {/* Office Info */}
          <div>
            <p className="font-semibold text-lg text-purple-700">OUR OFFICE</p>
            <p className="text-orange-500  leading-relaxed">
              54709 Willms Station <br /> Suite 350, Washington, USA
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <p className="text-orange-500">
              Tel: <a href="tel:+918084690455" className="underline hover:text-purple-700">+91 8084690455</a> <br />
              Email: <a href="mailto:archanakumarigupt8@gmail.com" className="underline hover:text-purple-500">archanakumarigupt8@gmail.com</a>
            </p>
          </div>

          {/* Careers Info */}
          <div>
            <p className="font-semibold text-lg text-purple-700">CAREERS AT LifehealthCare</p>
            <p className="text-orange-500">Learn more about our teams and job openings.</p>
          </div>

          {/* Explore Jobs Button */}
          <button className="border border-gray-800 px-8 py-3 text-sm rounded-full text-gray-800 hover:bg-gradient-to-r hover:from-purple-500 hover:to-indigo-500 hover:text-white transition-all duration-300">
            Explore Jobs
          </button>

        </div>
      </div>

    </div>
  );
};

export default Contact;
