import validator from 'validator'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import userModel from '../models/userModel.js'
import{ v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appoinmentModel from '../models/appoinmentModel.js'
import razorpay from 'razorpay'

const regiterUser = async (req,res) => {
    try {
        const {name, email, password} = req.body

        if (!name || !email || !password) {
            return res.json({success: false, message: 'Missing Details'})
        }

        if (!validator.isEmail(email)) {
            return res.json({success: false, message: 'Enter a valid email'})
        }

        if (password.length < 8) {
            return res.json({success: false, message: 'Enter a strong password'})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)

        const userData = {
            name,
            email,
            password: hashPassword
        }

        const newUser = new userModel(userData)
        const user = await newUser.save()

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

        res.json({success: true, token})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const loginUser = async (req,res) => {
    try {
        const {email, password} = req.body
        const user = await userModel.findOne({email})

        if (!user) {
            return res.json({success: false, message: 'User does not exist'})
        }

        const isMatch = await bcrypt.compare(password, user.password)

        if (isMatch) {
            const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)
            res.json({success: true, token})
        } else {
            res.json({success: false, message: 'Invalid credentials'})
        }

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const getProfile = async (req,res) => {
    try {
        const {userId} = req.body
        const userData = await userModel.findById(userId).select('-password')

        res.json({success: true, userData})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const updateProfile = async (req,res) => {
    try {
        const {userId, name, phone, address, dob, gender} = req.body
        console.log(req.body)
        const imageFile = req.file

        if (!name || !phone || !dob || !gender) {
            return res.json({success: false, message: 'Data missing'})
        }

        await userModel.findByIdAndUpdate(userId,{name,phone,address:JSON.parse(address),dob,gender})

        if (imageFile) {
            const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:'image'})
            const imageURL = imageUpload.secure_url

            await userModel.findByIdAndUpdate(userId,{image:imageURL})
        }

        res.json({success: true, message: 'Profile Updated'})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const bookAppoinment = async (req,res) => {
    try {
        const {userId, docId, slotDate, slotTime} = req.body
        const docData = await doctorModel.findById(docId).select('-password')

        if (!docData.available) {
            return res.json({success: false, message: 'Doctor not available'})
        }

        let slots_booked = docData.slots_booked

        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) {
                return res.json({success: false, message: 'Slot not available'})
            } else {
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        const userData = await userModel.findById(userId).select('-password')

        delete docData.slots_booked

        const appoinmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now()
        }

        const newAppoinment = new appoinmentModel(appoinmentData)
        await newAppoinment.save()

        await doctorModel.findByIdAndUpdate(docId,{slots_booked})

        res.json({success: true, message: 'Appoinment booked'})


    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const listAppoinment = async (req,res) => {
    try {
        const {userId} = req.body
        const appoinments = await appoinmentModel.find({userId})

        res.json({success: true, appoinments})
    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

const cancelAppoinment = async (req,res) => {
    try {
        const {userId, appoinmentId} = req.body
        const appoinmentData = await appoinmentModel.findById(appoinmentId)

        if (appoinmentData.userId !== userId) {
            return res.json({success: false, message: 'Unautherized action'})
        }

        await appoinmentModel.findByIdAndUpdate(appoinmentId, {cancelled: true})

        const {docId, slotDate, slotTime} = appoinmentData
        const doctorData = await doctorModel.findById(docId)
        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)
        await doctorModel.findByIdAndUpdate(docId, {slots_booked})

        res.json({success: true, message: 'Appoinment cancelled'})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

// const razorpayInstance = new razorpay({
//     key_id:'',
//     key_secret:''
// })

const paymentRazorpay= async (req,res) => {
    try {
        const {appoinmentId} = req.body
        const appoinmentData = await appoinmentModel.findById(appoinmentId)

        if (!appoinmentData || appoinmentData.cancelled) {
            return res.json({success: false, message: 'Appoinment cancelled or not found'})
        }

        const option = {
            amount: appoinmentData.amount * 100,
            currency: process.env.CURRENCY,
            receipt: appoinmentId
        }

        const order = await razorpayInstance.orders.create(option)
        res.json({success: true, order})

    } catch (error) {
        console.log(error)
        res.json({success: false, message: error.message})
    }
}

export {regiterUser, loginUser, getProfile, updateProfile, bookAppoinment, listAppoinment, cancelAppoinment, paymentRazorpay}