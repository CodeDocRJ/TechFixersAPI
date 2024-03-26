const express = require( 'express' );
const productCategoryRouter = express.Router();

const { getProductCategory } = require( '../../controller/user/productCategoryController.js' );

productCategoryRouter.get( '/getProductCategory', getProductCategory );

module.exports = productCategoryRouter;