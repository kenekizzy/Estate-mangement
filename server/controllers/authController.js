import User from "../models/userModel.js"
import bcrypt from 'bcrypt'
import asyncHandler from 'express-async-handler'
import { generateJWTToken, generateEmailToken } from "../utils/generateToken.js"
import { sendVerificationEmail } from "../middleware/emailSender.js"
import PasswordResetToken from "../models/passwordResetTokenModel.js"
import { verifyUser } from "../middleware/verifyToken.js"

//Register User 
const signupUser = asyncHandler( async (req, res) => {
    const { username, email, password} = req.body

    if(!username || !email || !password){
        res.status(400)
        throw new Error("Invalid form details")
    }

    const userExists = await User.findOne({email})

    if(userExists){
        res.status(400)
        throw new Error("User Exists already")
    }

    const salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)
    const newUser = await User.create({username, email, password: hashedPassword})

    let {password: pass, ...userDetails}  = newUser._doc

    const verifyToken = generateEmailToken(username, email)

    const resultMail = await sendVerificationEmail(email, verifyToken, username)

    res.status(201).json({user: userDetails})

})

//Login User
const loginUser = asyncHandler ( async (req, res) => {
    const { email, password} = req.body

    if(!email || !password) {
        res.status(400)
        throw new Error("Invalid form details")
    }

    const userExists = await User.findOne({ email })

    if(!userExists) {
        res.status(400)
        throw new Error("Invalid Credential Details")
    }

    const comparePassword = await bcrypt.compare(password, userExists.password)

    if(!comparePassword){
        res.status(400)
        throw new Error("Invalid Credential Details")
    }

    if(!userExists.isVerified){
        res.status(400)
        throw new Error("Unverified User")
    }

    const {password: pass, ...userDetails} = userExists._doc

    const token = generateJWTToken(userExists._id)

    res.status(200).json({ user: userDetails, token})
})

//Verify User's Email
const verifyEmail = asyncHandler( async (req, res) => {
    const { username} = req.body

    const user = req.user

    if(user.username !== username){
        res.status(400)
        throw new Error("invalid token")
    }
    const userExists = await User.findOne({email: user.email})

    if(!userExists){
        res.status(400)
        throw new Error("Invalid user")
    }
    const updatedUser = await User.findByIdAndUpdate(userExists._id, {
        $set: {
            isVerified: true
        }
    }, {new: true})

    res.status(200).json({message: "Verification Complete"})

})

//Google Sign In User
const signInGoogleUser = asyncHandler (async (req, res) => {
    const {name, email, photo} = req.body

    if(!name || !email){
        res.status(400)
        throw new Error("Invalid Credentials")
    }

    const userExists = await User.findOne({ email })
    
    if(userExists){
        const token = generateJWTToken(userExists._id)
        const {password: pass, ...userDetails} = userExists._doc

        res.status(200).json({ user: userDetails, token, message: "Sign In Successful"})
    }else{
        const generatedPassword = Math.random().toString(36).slice(-8)
        const generatedUserName = name.split(" ").join("")

        const salt = await bcrypt.genSalt(10)
        let hashedPassword = await bcrypt.hash(generatedPassword, salt)

        const newUser = await User.create({username: generatedUserName, email, password: hashedPassword, avatar: photo})

        const token = generateJWTToken(newUser._id)

        const {password: pass, ...userDetails} = newUser._doc

        res.status(201).json({ user: userDetails, token, message: "Sign In Successful"})
    }

})

//Trigger Forgot Password
const triggerResetPassword = asyncHandler (async (req, res) => {
    const { email } = req.body
    
    const userExists = await User.findOne({email})

    if(!userExists){
        res.status(400)
        throw new Error("Invalid User Details")
    }

    const token = generatePasswordResetToken(userExists)
})

//Reset Forgot Password Implementation
const resetPassword = asyncHandler (async (req, res) => {
    const {resetToken, password} = req.body
    
    const tokenData = await PasswordResetToken.findOne({token: resetToken})

    if(!tokenData){
        res.status(400)
        throw new Error("Invalid token")
    }

    if(tokenData.blacklist){
        rest.status(400)
        throw new Error("Token has been blacklisted")
    }

    const user = await User.findById(token.userId)
    
    if(!user){
        res.status(400)
        throw new Error("Invalid user identified")
    }

    const salt = await bcrypt.genSalt(10)
    let hashedPassword = await bcrypt.hash(password, salt)

    const updatePassword = await User.findByIdAndUpdate(user._id, {
        $set: {
            password: hashedPassword
        }
    })

    const blacklistToken = await PasswordResetToken.findByIdAndUpdate(tokenData._id, {
        $set: {
            blacklist: true
        }
    })

    res.status(201).json({message: "Password updated successfully"})

})

const signOutUser = asyncHandler( async (req, res) => {
    
})

export { signupUser, loginUser, verifyEmail, signInGoogleUser, triggerResetPassword, resetPassword, signOutUser }