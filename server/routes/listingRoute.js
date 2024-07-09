import express from 'express'

const router = express.Router()

import { createListing, updateListing, deleteListing, getSingleListing, getAllListings } from '../controllers/listingController.js'

import { authorizeUser } from '../middleware/verifyToken.js'

router.post("/create-listing", authorizeUser, createListing)

router.put("/update-listing/:id", authorizeUser, updateListing)

router.delete("/delete-listing/:id", authorizeUser, deleteListing)

router.get("/get-listing/:id", getSingleListing)

router.get("/get-all-listing", getAllListings)


export default router