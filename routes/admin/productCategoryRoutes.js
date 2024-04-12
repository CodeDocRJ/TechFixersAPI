const express = require( 'express' );
const productCategoryRouter = express.Router();

const { uploadcategoryImage } = require( '../../utils/imageUpload.js' );
const { addProductCategory, getProductCategoryList, getProductCategoryById, updateProductCategory, deleteProductCategory } = require( '../../controller/admin/productCategoryController' );

productCategoryRouter.post( '/addProductCategory', uploadcategoryImage, addProductCategory );

productCategoryRouter.get( '/getProductCategoryList', getProductCategoryList );

productCategoryRouter.get( '/getProductCategory/:productCategoryId', getProductCategoryById );

productCategoryRouter.put( '/updateProductCategory/:productCategoryId', uploadcategoryImage, updateProductCategory );

productCategoryRouter.delete( '/deleteProductCategory/:productCategoryId', deleteProductCategory );

module.exports = productCategoryRouter;