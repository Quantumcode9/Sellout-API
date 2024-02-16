// import dependencies
const mongoose = require('mongoose')


const soundbarSchema = new mongoose.Schema({
    brand: {
        type: String, 
        enum: ['Samsung', 'LG', 'Sony', 'Bose', 'JBL', 'Sonos', 'other'], 
        required: true
    },
    modelNumber: {
        type: String, 
        required: true
    },
    image: { 
        type: String, 
        required: true 
    },
    image2: {
        type: String,
        required: false
    },
    channels: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    dolbyAtmos: {
        type: Boolean,
        required: true
    },
    sku: {
        type: String,
        required: false
    },
    rating: {
        type: Number,
        required: true
    }
}, { timestamps: true })

module.exports = mongoose.model('Soundbar', soundbarSchema)
