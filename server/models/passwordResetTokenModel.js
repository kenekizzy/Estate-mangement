import mongoose from "mongoose";

const passwordResetTokenSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: true
    },
    token: {
        type: String,
        required: true,
    },
    blacklist: {
        type: Boolean,
        default: false
    },
    createdAt: { 
        type: Date,
         default: Date.now, 
         expires: 3600 
    },
}, { timestamps: true})

const PasswordResetToken = mongoose.model('PasswordResetToken', passwordResetTokenSchema)

export default PasswordResetToken