import React from 'react'
import { useContext } from 'react'
import { useState } from 'react'
import { AdminContext } from '../context/AdminContext'
import axios from 'axios'
import { toast } from 'react-toastify'
import { DoctorContext } from '../context/DoctorContext'

const Login = () => {

    const [state,setState] = useState('Admin')
    const [email,setEmail] = useState('Admin')
    const [password,setPassword] = useState('Admin')

    const {setAToken,backendurl} = useContext(AdminContext)
    const {setDToken} = useContext(DoctorContext)

    const submitHandler = async (event) => {
        event.preventDefault()
        
        try {
            if (state === 'Admin') {
                const {data} = await axios.post(backendurl + '/api/admin/login', {email, password})
                if (data.success) {
                    localStorage.setItem('aToken', data.token)
                    setAToken(data.token)
                } else {
                    toast.error(data.message)
                }
            } else {
                const {data} = await axios.post(backendurl + '/api/doctor/login', {email, password})
                if (data.success) {
                    localStorage.setItem('dToken', data.token)
                    setDToken(data.token)
                    console.log(data.token)
                } else {
                    toast.error(data.message)
                }
            }
        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

  return (
    <div>
      <form onSubmit={submitHandler} className='min-h-[80vh] flex flex-col items-center' action="">
        <div className='flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border border-gray-200 rounded-xl text-[#5E5E5E] text-sm shadow-lg'>
            <p className='text-2xl font-semibold m-auto'> <span className='text-blue-500'>{state}</span> Login </p>
            <div className='w-full'>
                <p>Email</p>
                <input onChange={(e)=>setEmail(e.target.value)} value={email} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="email" required />
            </div>
            <div className='w-full'>
                <p>Password</p>
                <input onChange={(e)=>setPassword(e.target.value)} value={password} className='border border-[#DADADA] rounded w-full p-2 mt-1' type="password" required />
            </div>
            <button className='bg-blue-500 text-white w-full py-2 rounded-md text-base cursor-pointer mt-3'>Login</button>
            {
                state === 'Admin'
                ? <p>Doctor Login? <span className='text-blue-500 underline cursor-pointer' onClick={()=>setState('Doctor')}>Click here</span></p>
                : <p>Admin Login? <span className='text-blue-500 underline cursor-pointer' onClick={()=>setState('Admin')}>Click here</span></p>
            }
        </div>
      </form>
    </div>
  )
}

export default Login
