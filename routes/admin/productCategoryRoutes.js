const express = require( 'express' );
const productCategoryRouter = express.Router();

const { uploadcategoryImage } = require( '../../utils/imageUpload.js' );
const { addProductCategory } = require( '../../controller/admin/productcategoryController.js' );

productCategoryRouter.post( '/addProductCategory', uploadcategoryImage, addProductCategory );

module.exports = productCategoryRouter;