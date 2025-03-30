import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
    return (
        <div id='speciality' className='mt-4  rounded flex flex-col items-center gap-6 py-16 text-[#262626] bg-gradient-to-b from-purple-50 to-purple-100'>
  <h1 className='text-3xl font-semibold text-purple-800'>Find by Speciality</h1>
  <p className='sm:w-1/2 text-center text-purple-600 text-sm'>
    Simply browse through our extensive list of trusted doctors and schedule your appointment hassle-free.
  </p>

  <div className='flex sm:justify-center gap-6 pt-8 w-full overflow-auto pb-4'>
    {specialityData.map((item, index) => (
      <Link 
        to={`/doctors/${item.speciality}`} 
        onClick={() => scrollTo(0, 0)} 
        key={index} 
        className='flex flex-col items-center text-sm font-medium text-purple-800 hover:text-pink-600 cursor-pointer flex-shrink-0 transition-transform transform hover:-translate-y-2'
      >
        <div className='w-16 sm:w-24 p-3 rounded-full shadow-md bg-gradient-to-r from-purple-300 to-pink-300 hover:shadow-xl transition-all'>
          <img className='w-full' src={item.image} alt={item.speciality} />
        </div>
        <p className='mt-3'>{item.speciality}</p>
      </Link>
    ))}
  </div>
</div>

    )
}

export default SpecialityMenu