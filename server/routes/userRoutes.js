import express from 'express'

const router = express.Router()

import { updateUser, deleteUser, getUser, getUserListings } from '../controllers/userController.js'

import { authorizeUser } from '../middleware/verifyToken.js'

router.put("/update/:id", authorizeUser, updateUser)

router.delete("/delete/:id", authorizeUser, deleteUser)

router.get("/listings/:id", authorizeUser, getUserListings)

router.get("/:id", getUser)

export default router