import express from 'express'
import {getProfile, postCreateUser,postLogin,postLogOut, resendOtp, verifyOtp} from '../controllers/authcontroller.js'
import { authmiddleware } from '../middleware/authmiddle.js'
const router=express.Router()

router.post('/register-user',postCreateUser)
router.post('/login',postLogin)
router.post('/logout',postLogOut)
router.get('/profile',authmiddleware, getProfile)
router.post('/verify-otp',verifyOtp)
router.post('/resend-otp',resendOtp)

export {router as authrouter}