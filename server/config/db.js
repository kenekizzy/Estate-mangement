import mongoose from "mongoose"

const connectDB = async() => {
    const conn = await mongoose.connect(process.env.MONGODB_URL)
    console.log("MongoDB Connected Successfully")
}

export { connectDB }