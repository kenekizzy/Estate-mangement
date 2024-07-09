import express from "express";

import dotenv from 'dotenv'

dotenv.config()

import cors from 'cors'

import { connectDB } from "./config/db.js";

import {errorHandler} from './middleware/error.js'

import userRouter from "./routes/userRoutes.js";

import authRouter from "./routes/authRoutes.js"

import listingRouter from './routes/listingRoute.js'

//Connect to the Database
connectDB()

const port = process.env.PORT || 5000

const app = express()

app.use(cors())

app.use(express.json())

app.use("/api/user", userRouter)

app.use("/api/auth", authRouter)

app.use("/api/listing", listingRouter)

app.use(errorHandler)


app.listen(port, () => {
    console.log(`Server is running on Port ${port}`)
})