import express from 'express'
import { appoinmentCancel, appoinmentComplete, appoinmentsDoctor, doctorDashboard, doctorList, doctorProfile, editDoctorProfile, loginDoctor } from '../controllers/doctorController.js'
import authDoctor from '../middlewares/authDoctor.js'

const doctorRouter = express.Router()

doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor)
doctorRouter.get('/appoinments',authDoctor, appoinmentsDoctor)
doctorRouter.post('/complete-appoinment',authDoctor, appoinmentComplete)
doctorRouter.post('/cancel-appoinment',authDoctor, appoinmentCancel)
doctorRouter.get('/dashboard',authDoctor, doctorDashboard)
doctorRouter.get('/profile',authDoctor, doctorProfile)
doctorRouter.post('/update-profile',authDoctor, editDoctorProfile)

export default doctorRouter