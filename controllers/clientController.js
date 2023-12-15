const Client = require('../models/clientModel')
const Vendor = require('../models/vendorModel')
const mongoose = require('mongoose')
require('dotenv').config()


// Register a client purchase item info into the invoice
const registerClient = async (req, res) => {
    const {clientName, clientEmail, clientStreetAddress, clientCountry, clientCity, clientPostalCode, 
          clientPhone} = req.body

       
        try {
            if(!clientName || !clientEmail || !clientStreetAddress || !clientCountry || !clientCity || !clientPostalCode 
                || !clientPhone) {
                res.status(400).json({msg: "Please fill in all fields"})
                return
            }else{
    
                // creating the client purchase info
                const clientInfo = new Client({...req.body, vendor:req.vendor.id})
    
                // saving the client purchase info to the database
                const savedClientInfo = await clientInfo.save()
    
                return res.status(201).json(savedClientInfo)
            }
        } catch (error) {
            res.status(500).json(error.message)
        }
}

// View a single item from the invoice
const getSingleClient = async (req, res) => {
    const { clientId } = req.params

    try {
        
        if(!mongoose.Types.ObjectId.isValid(clientId)) return res.status(404).json({Err: "No such item detail found"})

        const clientInfo = await Client.findById(clientId)
        if(!clientInfo) return res.status(404).json({msg:"No such client details found"})

        const billWasGivenBy = await Vendor.findById(clientInfo.vendor.toString()).select('-password')

        res.status(200).json({clientInfo, billWasGivenBy})
    } catch (error) {
        res.status(500).json(error.message)
    }
}

// view all bill info from the invoice
const getAllClients = async (req, res) => {
    try {
        const clients = await Client.find({vendor: req.vendor._id}).sort({ createdAt: -1 })

        res.status(200).json(clients)
    } catch (error) {
        res.status(500).json({Err: error.message})
    }
}

// Update a bill info
const deleteAClientInfo = async (req, res) => {

    const { clientId } = req.params
    
    try {

        if(!mongoose.Types.ObjectId.isValid(clientId)) return res.status(404).json({msg: "No such client  found!!"})

        const signedInvendorId = await Vendor.findById(req.vendor.id)

        const clientTodelete = await Client.findById(clientId)

        if(!clientTodelete) return res.status(404).json({msg:"No such client found!"})

        if(await Vendor.findById(req.vendor) === null) return res.status(404).json({msg: "Vendor not found"})
        
        if(clientTodelete.vendor.toString() !== signedInvendorId._id.toString()) return res.status(401).json({msg: "Not authorized"})

        const deletedClient = await Client.findOneAndDelete({_id: clientId})

        res.status(200).json({msg:"Bill details deleted successfully", deletedClient})
    } catch (error) {
        res.status(500).json({Err: error.message})
    }
}

// update vendor account
const updateClientInfo = async (req, res) => {

    // Take Note: req.vendor is gotten when a vendor is authenticated into the app 
    // and this data contains all the vendors details
    // And this was being set that way from the auth middleware file in the middlewares folder
    const {clientId} = req.params

    try {
        
        if(!mongoose.Types.ObjectId.isValid(clientId)) return res.status(404).json({msg: "No such client  found!!"})

        if(await Vendor.findById(req.vendor) === null) return res.status(404).json({msg: "Vendor not found"})

        const signedInvendorId = await Vendor.findById(req.vendor.id)

        const foundClient = await Client.findById(clientId)

        if(!foundClient) return res.status(404).json({msg:"No such client found!"})
        
        if(foundClient.vendor.toString() !== signedInvendorId._id.toString()) return res.status(401).json({msg: "Not authorized"})

        // If all checks pass, the account is then updated and then returns the newly updated item
        const clientToUpdate = await Client.findOneAndUpdate({_id: clientId}, {...req.body}, {new: true})

        res.status(200).json(clientToUpdate)
    } catch (error) {
        res.status(500).json({Err: error.message})
    }
}


module.exports = {
    registerClient,
    getSingleClient,
    getAllClients,
    deleteAClientInfo,
    updateClientInfo,
    
}