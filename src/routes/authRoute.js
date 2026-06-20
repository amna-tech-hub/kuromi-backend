import express from 'express'
import {getProfile, postCreateUser,postLogin,postLogOut, verifyOtp} from '../controllers/authcontroller.js'
import { authmiddleware } from '../middleware/authmiddle.js'
const router=express.Router()

router.post('/register-user',postCreateUser)
router.post('/login',postLogin)
router.post('/logout',postLogOut)
router.get('/profile',authmiddleware, getProfile)
router.post('/verify-otp',verifyOtp)
export {router as authrouter}