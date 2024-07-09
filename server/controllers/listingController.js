import Listing from "../models/listingModel.js";
import asyncHandler from 'express-async-handler'

const createListing = asyncHandler( async(req, res) => {
    const {userId} = req.user
    if(userId != req.body.userRef){
        res.status(400)
        throw new Error("Invalid user creation details")
    }

    const listing = await Listing.create(req.body)

    res.status(201).json({listing, message: "Listing created successfully"})

})

const getSingleListing = asyncHandler( async(req, res) => {
    const { id } = req.params

    if(!id){
        res.status(404)
        throw new Error("Invalid Id")
    }

    const listing = await Listing.findById(id)

    if(!listing){
        res.status(400)
        throw new Error("Listing not found")
    }

    res.status(200).json({listing, message: "Successful"})
})

const updateListing = asyncHandler( async (req, res) => {
    const { id } = req.params
    const { userId } = req.user

    if(!id){
        res.status(404)
        throw new Error("Invalid Id")
    }

    const listing = await Listing.findById(id)

    if(!listing){
        res.status(400)
        throw new Error("Invalid Listing Id")
    }

    if(userId !== listing.userRef){
        res.status(400)
        throw new Error("You can't update this listing")
    }

    const updatedListing = await Listing .findByIdAndUpdate(id, req.body, {new: true})

    res.status(200).json({data: updatedListing, message: "Listing updated successfully"})
})

const deleteListing = asyncHandler( async (req, res) => {
    const { id } = req.params
    const { userId } = req.user

    if(!id){
        res.status(404)
        throw new Error("Invalid Id")
    }

    const listing = await Listing.findById(id)

    if(!listing){
        res.status(400)
        throw new Error("Invalid Listing Id")
    }

    if(userId !== listing.userRef){
        res.status(400)
        throw new Error("You can't delete this listing")
    }

    await Listing .findByIdAndDelete(id)

    res.status(200).json({message: "Listing Deleted"})
})

const getAllListings = asyncHandler( async (req, res) => {
    //Get query limit as a query parameter
    const limit = parseInt(req.query.limit) || 9;
    //Get the startIndex from the query parameters or set as default 0
    const startIndex = parseInt(req.query.startIndex) || 0;
    //Get the value for offer from the query parameter
    let offer = req.query.offer;

    //if offer is false or undefined, search the database for places where offer is both false and true
    if (offer === undefined || offer === 'false') {
      offer = { $in: [false, true] };
    }

    //Get the value of furnished from the query parameter
    let furnished = req.query.furnished;

    //If furnished is false or undefined, search the database for places where furnished is both true and false
    if (furnished === undefined || furnished === 'false') {
      furnished = { $in: [false, true] };
    }

    //Get the value of parking from the query parameter
    let parking = req.query.parking;

    //If parking is false or undefined, search the database for places where parking is both true and false
    if (parking === undefined || parking === 'false') {
      parking = { $in: [false, true] };
    }

    //Get the value of the type from the query parameter
    let type = req.query.type;

    //if type is undefined or all, search the database for places where type is both sale and rent
    if (type === undefined || type === 'all') {
      type = { $in: ['sale', 'rent'] };
    }

    //Get other values from the query parameters or set default values
    const searchTerm = req.query.searchTerm || '';

    const sort = req.query.sort || 'createdAt';

    const order = req.query.order || 'desc';

    const listings = await Listing.find({
      //Searching the names in the database: Regex allows you to search the db for matching letters while options allows you to ignore the casing  
      name: { $regex: searchTerm, $options: 'i' },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    res.status(200).json({listings, message: "Successful"});

})

export  {createListing, getSingleListing, getAllListings, updateListing, deleteListing}