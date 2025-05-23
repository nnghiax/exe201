const mongoose = require('mongoose');

const rentalSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users',
        required: true
    },
    storeId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'stores',
        required: true
    },
    items: [
        {
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'products',
                required: true
            },
            size: {
                type: String,
                required: true
            },
            quantity: {
                type: Number,
                required: true,
                min: 1
            }
        }
    ],
    rentalDate: {
        type: Date,
        required: true
    },
    returnDate: {
        type: Date,
        required: true
    },
    totalAmount: {
        type: Number,
        required: true,
        min: 0
    },
    depositAmount: {
        type: Number,
        required: true,
        min: 0
    },
    paymentMethod: {
        type: String,
        enum: ['vnpay', 'cod'],
        required: true
    },
    paymentStatus: {
        type: String,
        enum: ['unpaid', 'paid'],
        default: 'unpaid'
    },
    status: {
        type: String,
        enum: ['pending', 'confirmed', 'cancelled', 'completed'],
        default: 'pending'
    }
}, { timestamps: true });

module.exports = mongoose.model('rentals', rentalSchema);
