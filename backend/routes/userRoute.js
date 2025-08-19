import express from 'express'
import { bookAppoinment, cancelAppoinment, getProfile, listAppoinment, loginUser, paymentRazorpay, regiterUser, updateProfile } from '../controllers/UserController.js'
import authUser from '../middlewares/authUser.js'
import upload from '../middlewares/multer.js'

const userRouter = express.Router()

userRouter.post('/register', regiterUser)
userRouter.post('/login', loginUser)
userRouter.get('/get-profile',authUser,getProfile)
userRouter.post('/update-profile',upload.single('image'),authUser,updateProfile)
userRouter.post('/book-appoinment',authUser,bookAppoinment)
userRouter.get('/appoinments',authUser,listAppoinment)
userRouter.post('/cancel-appoinment',authUser,cancelAppoinment)
userRouter.post('/payment-razorpay',authUser,paymentRazorpay)

export default userRouter