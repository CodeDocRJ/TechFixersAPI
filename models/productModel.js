const mongoose = require( 'mongoose' );

const productSchema = new mongoose.Schema( {
    categoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ProductCategory'
    },
    name: String,
    type: String,
    brand: String,
    model: String,
    price: Number,
    description: String,
    productImage: String,
    rating: {
        rate: Number,
        count: Number
    }
}, {
    timestamps: true,
} );

const ProductModel = mongoose.model( 'Product', productSchema );

module.exports = ProductModel;