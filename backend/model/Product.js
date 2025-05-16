const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
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
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'categories',
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    image: String,
    description: {
        type: String,
        default: ''
    },
    sizes: [
        {
            label: String,       // ví dụ: 'S', 'M', 'L', 'XL'
            quantity: Number,    // số lượng có sẵn cho size đó
            price: Number        // giá thuê theo size
        }
    ],
    isAvailable: {
        type: Boolean,
        default: true
    }

}, { timestamps: true })

module.exports = mongoose.model('products', productSchema)