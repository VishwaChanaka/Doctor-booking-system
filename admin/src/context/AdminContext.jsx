import { useState } from "react";
import { createContext } from "react";
import axios from 'axios'
import { toast } from 'react-toastify'

export const AdminContext = createContext()

const AdminContextProvider = (props) => {
    const [aToken,setAToken] = useState(localStorage.getItem('aToken') ? localStorage.getItem('aToken') : '')
    const [doctors,setDoctors] = useState([])
    const [appoinments,setAppoinments] = useState([])
    const [dashData,setDashData] = useState(false)

    const backendurl = import.meta.env.VITE_BACKEND_URL

    const getAllDoctors = async () => {
        try {
            const {data} = await axios.post(backendurl + '/api/admin/all-doctors', {}, {headers:{aToken}})
            if (data.success) {
                setDoctors(data.doctors)
                console.log(data.doctors)
            } else {
                toast.error(data.message)
                console.log('hi11')
            }
        } catch (error) {
            toast.error(error.message)
            console.log('hi2')
            
        }
    }

    const changeAvailability = async (docId) => {
        try {
            const {data} = await axios.post(backendurl + '/api/admin/change-availability', {docId}, {headers: {aToken}})
            if (data.success) {
                toast.success(data.message)
                getAllDoctors()
            } else {
                toast.error(data.message)
                console.log('hiii')
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const getAllAppoinments = async () => {
        try {
            const {data} = await axios.get(backendurl + '/api/admin/appoinments', {headers: {aToken}})
            if (data.success) {
                setAppoinments(data.appoinments)
                console.log(data.appoinments)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const cancelAppoinment = async (appoinmentId) => {
        try {
            const {data} = await axios.post(backendurl + '/api/admin/cancel-appoinment', {appoinmentId}, {headers: {aToken}})
            if (data.success) {
                toast.success(data.message)
                getAllAppoinments()
            } else {
                toast.error(data.message)
                console.log('hi')
            }
        } catch (error) {
            toast.error(error.message)
            console.log('hi1')
        }
    }

    const getDashData = async () => {
        try {
            const {data} = await axios.get(backendurl + '/api/admin/dashboard', {headers: {aToken}})
            if (data.success) {
                setDashData(data.dashData)
                console.log(data.dashData)
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    const value = {
        aToken,setAToken,
        backendurl,doctors,
        getAllDoctors,changeAvailability,
        appoinments,setAppoinments,
        getAllAppoinments,
        cancelAppoinment,
        dashData,getDashData,
    }

    return (
        <AdminContext.Provider value={value}>
            {props.children}
        </AdminContext.Provider>
    )
}

export default AdminContextProvider