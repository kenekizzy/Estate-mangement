import asyncHandler from 'express-async-handler'
import bcrypt from 'bcrypt'
import User from '../models/userModel.js'
import Listing from '../models/listingModel.js'

const updateUser = asyncHandler ( async (req, res) => {
    const { id } = req.params
    const { userId } = req.user

    if(id != userId){
        res.status(400)
        throw new Error("Invalid user")
    }

    

    if(req.body.password){
        // const userExists = await User.findById(id)

        // const comparePassword = await bcrypt.compare(req.body.existingPassword, userExists.password)
        // if(!comparePassword){
        //     res.status(400)
        //     throw new Error("Invalid Existing Password")
        // }
        const salt = await bcrypt.genSalt(10)
        req.body.password = await bcrypt.hash(req.body.password, salt)
    }

    const updatedUser = await User.findByIdAndUpdate(id, {
        $set: {
            username: req.body.username,
            email: req.body.email,
            password: req.body.password,
            avatar: req.body.avatar
        }
    }, {new: true})
    const {password, ...userDetails} = updatedUser._doc

    res.status(200).json({user: userDetails, message: "User updated Succesfully"})
})

const deleteUser = asyncHandler( async (req, res) => {
    const { id } = req.params
    const { userId } = req.user

    if(id != userId){
        res.status(400)
        throw new Error("Invalid User")
    }

    const deletedUser = await User.findByIdAndDelete(id)
    res.status(200).json({message: "User Successfully deleted"})
})

const getUserListings = asyncHandler ( async (req, res) => {
    const { id } = req.params
    const { userId } = req.user

    if(id !== userId){
        res.status(400)
        throw new Error("You can only see your listings")
    }

    const listings = await Listing.find({ userRef: id });
    res.status(200).json({listings, message: "Successful"});

})

const getUser = asyncHandler ( async (req, res) => {
    const { id } = req.params
    const user = await User.findById(id);
  
    if (!user){
        res.status(400)
        throw new Error("User not found")
    };
  
    const { password: pass, ...rest } = user._doc;
  
    res.status(200).json({user: rest, message: "Successful"});
})

export { updateUser, deleteUser, getUserListings, getUser }