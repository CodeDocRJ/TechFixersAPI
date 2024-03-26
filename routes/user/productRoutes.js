const express = require( 'express' );
const { getProductList, getProduct } = require( '../../controller/user/productController' );
const { getRepairCategories } = require( '../../controller/user/repairController' );
const productRouter = express.Router();

productRouter.get( '/getProductList/:categoryId', getProductList );

productRouter.get( '/getProduct/:productId', getProduct );

//repair categories
productRouter.get( '/getRepairCategories', getRepairCategories );

module.exports = productRouter;