import express from 'express'
import {getProfile, postCreateUser,postforgetpassword,postLogin,postLogOut, resendOtp, verifyOtp,postresetpassword, verifyresetpassword} from '../controllers/authcontroller.js'
import { authmiddleware } from '../middleware/authmiddle.js'
const router=express.Router()

router.post('/register-user',postCreateUser)
router.post('/login',postLogin)
router.post('/logout',postLogOut)
router.get('/profile',authmiddleware, getProfile)
router.post('/verify-otp',verifyOtp)
router.post('/resend-otp',resendOtp)
router.post('/forget-password',postforgetpassword)
router.post('/reset-password',postresetpassword)
router.get('/verify-reset-token/:token',verifyresetpassword)

export {router as authrouter}