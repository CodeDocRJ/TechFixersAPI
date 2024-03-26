const express = require( 'express' );
const { addNewProduct, updateProduct, getProductList } = require( '../../controller/admin/productController' );
const { uploadproductImage } = require( '../../utils/imageUpload' );
const productRouter = express.Router();

productRouter.post( '/addNewProduct', uploadproductImage, addNewProduct );

productRouter.get( '/productList', getProductList );

productRouter.put( '/updateProduct/:productId', uploadproductImage, updateProduct );

module.exports = productRouter;