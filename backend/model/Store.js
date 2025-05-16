const mongoose = require('mongoose')

const storeSchema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    name: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        default: ''
    },
    address: {
        street: { type: String, required: true },
        ward: { type: String, required: true },
        district: { type: String, required: true },
        city: { type: String, required: true }
    },
    phone: {
        type: String,
        required: true,
    },
    image: String,
    isActive: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

module.exports = mongoose.model('stores', storeSchema)