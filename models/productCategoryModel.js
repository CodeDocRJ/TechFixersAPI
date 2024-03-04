const mongoose = require('mongoose');

const productCategorySchema = new mongoose.Schema({
    catName: String,
    catType: String
});

const ProductCategory = mongoose.model('ProductCategory', productCategorySchema);

module.exports = ProductCategory;