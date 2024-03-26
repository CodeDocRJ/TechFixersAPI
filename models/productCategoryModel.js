const mongoose = require( 'mongoose' );

const productCategorySchema = new mongoose.Schema( {
    catName: String,
    catType: String,
    categoryImage: String
}, {
    timestamps: true,
} );

const ProductCategoryModel = mongoose.model( 'ProductCategory', productCategorySchema );

module.exports = ProductCategoryModel;