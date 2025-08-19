import React from 'react'
import Login from './pages/Login'
import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css'
import { useContext } from 'react';
import { AdminContext } from './context/AdminContext';
import NavBar from './components/NavBar';
import Sidebar from './components/Sidebar';
import { Route, Routes } from 'react-router-dom'
import Dashboard from './pages/Admin/Dashboard';
import AllAppoinment from './pages/Admin/AllAppoinment';
import AddDoctor from './pages/Admin/AddDoctor';
import DoctorsList from './pages/Admin/DoctorsList';
import { DoctorContext } from './context/DoctorContext';
import DoctorDashboard from './pages/Doctor/DoctorDashboard';
import DoctorProfile from './pages/Doctor/DoctorProfile';
import DoctorAppoinments from './pages/Doctor/DoctorAppoinments';

const App = () => {

  const {aToken} = useContext(AdminContext)
  const {dToken} = useContext(DoctorContext)

  return aToken || dToken ? (
    <div className='bg-[#F8F9FD]'>
      <ToastContainer/>
      <NavBar/>
      <div className='flex items-start'>
        <Sidebar/>
        <Routes>
          <Route path='/' element={<Dashboard/>} />
          <Route path='/admin-dashboard' element={<Dashboard/>} />
          <Route path='/all-appoinment' element={<AllAppoinment/>} />
          <Route path='/add-doctor' element={<AddDoctor/>} />
          <Route path='/doctor-list' element={<DoctorsList/>} />

          <Route path='/doctor-dashboard' element={<DoctorDashboard/>} />
          <Route path='/doctor-appoinments' element={<DoctorAppoinments/>} />
          <Route path='/doctor-profile' element={<DoctorProfile/>} />
        </Routes>
      </div>
    </div>
  ) : (
    <div>
      <Login/>
      <ToastContainer/>
    </div>
  )
}

export default App
