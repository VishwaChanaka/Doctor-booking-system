import React from 'react'
import { useContext } from 'react'
import { AdminContext } from '../context/AdminContext'
import { NavLink } from 'react-router-dom'
import { assets } from '../assets/assets'
import { DoctorContext } from '../context/DoctorContext'

const Sidebar = () => {

    const {aToken} = useContext(AdminContext)
    const {dToken} = useContext(DoctorContext)

  return (
    <div className='min-h-screen bg-white border-r border-gray-200'>
      {
        aToken &&
        <ul className='texy-[#515151] mt-5'>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:min-w-72 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500' : ''}`} to={'/admin-dashboard'}>
                <img src={assets.home_icon} alt="" />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:min-w-72 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500' : ''}`} to={'/all-appoinment'}>
                <img src={assets.appointment_icon} alt="" />
                <p className='hidden md:block'>Appoinments</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:min-w-72 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500' : ''}`} to={'/add-doctor'}>
                <img src={assets.add_icon} alt="" />
                <p className='hidden md:block'>Add Doctor</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:min-w-72 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500' : ''}`} to={'/doctor-list'}>
                <img src={assets.people_icon} alt="" />
                <p className='hidden md:block'>Doctor List</p>
            </NavLink>
        </ul>
      }
      {
        dToken &&
        <ul className='texy-[#515151] mt-5'>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:min-w-72 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500' : ''}`} to={'/doctor-dashboard'}>
                <img src={assets.home_icon} alt="" />
                <p className='hidden md:block'>Dashboard</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:min-w-72 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500' : ''}`} to={'/doctor-appoinments'}>
                <img src={assets.appointment_icon} alt="" />
                <p className='hidden md:block'>Appoinments</p>
            </NavLink>
            <NavLink className={({isActive})=> `flex items-center gap-3 py-3.5 px-3 md:min-w-72 md:px-9 cursor-pointer ${isActive ? 'bg-[#F2F3FF] border-r-4 border-blue-500' : ''}`} to={'/doctor-profile'}>
                <img src={assets.people_icon} alt="" />
                <p className='hidden md:block'>Profile</p>
            </NavLink>
        </ul>
      }
    </div>
  )
}

export default Sidebar
