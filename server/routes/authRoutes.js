import express from 'express'

const router = express.Router()

import { loginUser, signupUser, signInGoogleUser, signOutUser, verifyEmail } from '../controllers/authController.js'

import { verifyUser } from '../middleware/verifyToken.js'

router.post("/signup", signupUser)

router.post('/login', loginUser)

router.post("/verify-email", verifyEmail)

router.post("/googleSignIn", signInGoogleUser)

router.get("/sign-out", signOutUser)

export default router