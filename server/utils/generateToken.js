import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'
import PasswordResetToken from '../models/passwordResetTokenModel.js'

dotenv.config()

const generateJWTToken = (userId)  => {
    const token = jwt.sign({userId}, process.env.JWT_SECRET, { expiresIn: "1h"})
    
    return token
}

const generateEmailToken = (username, email) => {
    // Generate verify-email token
    const verifyToken = jwt.sign({ username, email }, process.env.JWT_SECRET, { expiresIn: '1h' });

    return verifyToken
}

const generatePasswordResetToken = (user) => {
    const token = crypto.randomBytes(32).toString('hex')
    const resetToken = new PasswordResetToken({userId: user._id, token})
    resetToken.save()
    return token
}

export { generateJWTToken, generateEmailToken, generatePasswordResetToken }
