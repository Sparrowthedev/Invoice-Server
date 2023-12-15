const mongoose = require('mongoose')
const Schema = mongoose.Schema;

const ClientSchema = new Schema({
    vendor:{
        type: Schema.Types.ObjectId,
        ref: 'Vendor'
    },
    clientPhone:{
        type: String,
        required: [true, "Please Provide a Phone number"]
    },
    clientName: {
        type: String,
        required: [true, "Please Provide a name"]
    },
    clientEmail: {
        type: String,
        required: [true, "Please Provide an email"]
    },
    clientStreetAddress:{
        type: String,
        required: [true, "Please Provide your client street adress"]
    },
    clientCountry:{
        type: String,
        required: [true, "Please Provide your client country location"]
    },
    clientCity:{
        type: String,
        required: [true, "Please Provide your client city"]
    },
    invoices: [{ type: Schema.Types.ObjectId, ref: 'Invoice' }],
    clientPostalCode:{
        type: String,
        required: [true, "Please Provide your client postal code loaction"]
    },
}, {timestamps: true})

module.exports = mongoose.model('Client', ClientSchema)