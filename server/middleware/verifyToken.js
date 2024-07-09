import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import crypto from 'crypto'
dotenv.config()

const authorizeUser = asyncHandler(async (req, res, next) => {
    let token
    let authHeader = req.headers.authorization || req.headers.Authorization
    if(authHeader && authHeader.startsWith("Bearer")){
        token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401)
                throw new Error("User not authorized")
            }
            req.user = decoded
            next()
        })
    }

    if(!token){
        res.status(401)
        throw new Error("Invalid token")
    }
})

const verifyUser = asyncHandler(async (req, res, next) => {
    const { token } = req.body;

    // Verify the token
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ message: 'Token verification failed' });
        }
        // Attach the decoded token to the request object
        req.user = decoded;
        next();
    });
    
})

export {authorizeUser, verifyUser}