import React from 'react';
import { assets } from '../assets/assets';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPhone, faEnvelope,faBriefcase } from '@fortawesome/free-solid-svg-icons';
import {   faLinkedin ,faGithub,} from '@fortawesome/free-brands-svg-icons';


const Footer = () => {
  return (
    <footer className="bg-gray-900 rounded text-white px-6 md:px-20 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-16">

        {/* Logo and About Section */}
        <div className="space-y-4">
          <img className="w-36" src={assets.logo} alt="HealthMate Logo" />
          <p className="text-sm leading-6 text-gray-400">
            Pulse<span className='text-orange-600 italic ps-1 pe-2'>Point</span> is your trusted healthcare appointment partner, simplifying access to healthcare with fast and easy doctor bookings. We prioritize convenience, trust, and patient care.
          </p>
        </div>

        {/* Company Links Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Company</h3>
          <ul className="space-y-2">
            <li><a href="#" className="hover:text-orange-600 transition">Home</a></li>
            <li><a href="#about" className="hover:text-orange-600 transition">About Us</a></li>
            <li><a href="#delivery" className="hover:text-orange-600 transition">Delivery</a></li>
            <li><a href="#privacy-policy" className="hover:text-orange-600 transition">Privacy Policy</a></li>
          </ul>
        </div>

        {/* Help & Resources Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Help & Resources</h3>
          <ul className="space-y-2">
            <li><a href="#faq" className="hover:text-orange-600 transition">FAQ</a></li>
            <li><a href="#support" className="hover:text-orange-600 transition">Support Center</a></li>
            <li><a href="#terms" className="hover:text-orange-600 transition">Terms & Conditions</a></li>
          </ul>
        </div>

        {/* Get in Touch Section */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-purple-600">Get in Touch</h3>
          <ul className="space-y-2">
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faPhone} className="text-purple-600" />
              <a href="tel:+918084690455" className="hover:text-orange-600">+91-8434419170</a>
            </li>
            <li className="flex items-center gap-2">
              <FontAwesomeIcon icon={faEnvelope} className="text-purple-600" />
              <a href="mailto:utsavkumar12203@gmail.com" className="hover:text-orange-600">utsavkumar12203@gmail.com</a>
            </li>
          </ul>

          {/* Social Media Links */}
          <div className="mt-4">
            <h4 className="text-md mb-2">Follow Us</h4>
            <div className="flex gap-6 text-gray-400">
      <a
        href="https://github.com/uts8434"
        className="text-blue-700 hover:text-white transition-transform transform hover:scale-110 "
      >
        <FontAwesomeIcon icon={faGithub} className="text-2xl" />
      </a>
      <a
        href="https://utsavkumarsingh.vercel.app/"
        className="text-blue-600 hover:text-white transition-transform transform hover:scale-110"
      >
        <FontAwesomeIcon icon={faBriefcase} className="text-2xl" />
      </a>
      <a
        href="https://www.linkedin.com/in/utsavkrsingh8434/"
        className="text-blue-800 hover:text-white transition-transform transform hover:scale-110"
      >
        <FontAwesomeIcon icon={faLinkedin} className="text-2xl" />
      </a>
    </div>
          </div>
        </div>
      </div>

      {/* Footer Bottom Section */}
      <div className="mt-10">
        <hr className="border-t border-gray-700" />
        <p className="py-4 text-center text-sm text-gray-500">
          Copyright {new Date().getFullYear()} @ <span className='text-orange-700'>Pulse <span className='text-orange-700 italic'>Point</span></span> - All Rights Reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
