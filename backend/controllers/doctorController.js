import doctorModel from '../models/doctorModel.js'
import dotorModel from '../models/doctorModel.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import appoinmentModel from '../models/appoinmentModel.js'

const changeAvailability = async (req,res) => {
    try {
        const {docId} = req.body

        const docData = await dotorModel.findById(docId)
        await dotorModel.findByIdAndUpdate(docId, {available: !docData.available})
        res.json({success: true, message: 'Availability changed'})
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const doctorList = async (req,res) => {
    try {
        const doctors = await doctorModel.find({}).select(['-password','-email'])
        res.json({success: true, doctors})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const loginDoctor = async (req,res) => {
    try {
        const {email, password} = req.body
        const doctor = await doctorModel.findOne({email})

        if (!doctor) {
            return res.json({success: false, message: 'Invalid credentials'})
        }

        const isMatch = await bcrypt.compare(password, doctor.password)

        if (isMatch) {
            const token = jwt.sign({id:doctor._id},process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: 'Invalid credentials'})
        }
        
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const appoinmentsDoctor = async (req,res) => {
    try {
        const {docId} = req.body
        const appoinments = await appoinmentModel.find({docId})

        res.json({success: true, appoinments})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const appoinmentComplete = async (req,res) => {
    try {
        const {docId,appoinmentId} = req.body
        const appoinmentData = await appoinmentModel.findById(appoinmentId)

        if (appoinmentData && appoinmentData.docId === docId) {
            await appoinmentModel.findByIdAndUpdate(appoinmentId, {isCompleted: true})
            return res.json({success: true, message: 'Appoinment completed'})
        } else {
            return res.json({success: false, message: 'Mark failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const appoinmentCancel = async (req,res) => {
    try {
        const {docId,appoinmentId} = req.body
        const appoinmentData = await appoinmentModel.findById(appoinmentId)

        if (appoinmentData && appoinmentData.docId === docId) {
            await appoinmentModel.findByIdAndUpdate(appoinmentId, {cancelled: true})
            return res.json({success: true, message: 'Appoinment cancelled'})
        } else {
            return res.json({success: false, message: 'Cancellation failed'})
        }

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const doctorDashboard = async (req,res) => {
    try {

        const {docId} = req.body

        const appoinments = await appoinmentModel.find({docId})

        let earning = 0

        appoinments.map((item) => {
            if (item.isCompleted || item.payment) {
                earning += item.amount
            }
        })

        let patients = []

        appoinments.map((item) => {
            if (!patients.includes(item.userId)) {
                patients.push(item.userId)
            }
        })

        const dashData = {
            earning,
            appoinments: appoinments.length,
            patients: patients.length,
            latestAppoinments: appoinments.reverse().slice(0,5)
        }

        res.json({success: true, dashData})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message}) 
    }
}

const doctorProfile = async (req,res) => {
    try {
        const {docId} = req.body
        const profileData = await doctorModel.findById(docId).select('-password')

        res.json({success: true, profileData})
    } catch (error) {
        console.log(error)
        console.log('hi')
        res.json({success: false, message: error.message})
    }
}

const editDoctorProfile = async (req,res) => {
    try {
        const {docId} = req.body
        const {fees,address,available} = req.body.updateData
        const a = await doctorModel.findByIdAndUpdate(docId, {fees, address, available})

        res.json({success: true, message: 'Profile updated'})
    } catch (error) {
        console.log(error)
        console.log('hi')
        res.json({success: false, message: error.message})
    }
}

export {changeAvailability, doctorList, loginDoctor, appoinmentsDoctor, appoinmentComplete, appoinmentCancel, doctorDashboard, doctorProfile, editDoctorProfile}