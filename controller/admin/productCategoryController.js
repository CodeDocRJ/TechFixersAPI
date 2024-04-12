const { getResult, getErrorResult } = require( "../../base/baseController" );
const ProductCategoryModel = require( "../../models/productCategoryModel" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ADMIN, ERROR } = require( "../../utils/message" );

const cloudinary = require( 'cloudinary' ).v2;

module.exports.addProductCategory = async ( req, res ) =>
{
    try
    {
        const { catName, catType } = req.body;

        const existingCategory = await ProductCategoryModel.findOne( { catName } );
        if ( existingCategory )
        {
            return getErrorResult( res, HttpStatusCode.BadRequest, ADMIN.product_category.alreadAxists );
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Appliances' } );

        const newProductCategory = new ProductCategoryModel( {
            catName,
            catType,
            categoryImage: result.secure_url // Save Cloudinary image URL
        } );

        await newProductCategory.save();

        return getResult( res, HttpStatusCode.Ok, newProductCategory, ADMIN.product_category.added );
    } catch ( error )
    {
        console.error( "Error in add product category : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getProductCategoryList = async ( req, res ) =>
{
    try
    {
        const productCategories = await ProductCategoryModel.find();

        if ( productCategories.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, productCategories, ADMIN.product_category.list );
    } catch ( error )
    {
        console.error( "Error in get product category list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getProductCategoryById = async ( req, res ) =>
{
    try
    {
        const { productCategoryId } = req.params;

        const productcategory = await ProductCategoryModel.findById( productCategoryId );

        if ( !productcategory )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, productcategory, ADMIN.product_category.get );
    } catch ( error )
    {
        console.error( "Error in get product category by id : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.updateProductCategory = async ( req, res ) =>
{
    try
    {
        const { productCategoryId } = req.params;
        const { catName, catType } = req.body;
        const categoryImage = req.file;

        const productcategory = await ProductCategoryModel.findById( productCategoryId );

        if ( !productcategory )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
        }
        if ( catName )
        {
            productcategory.catName = catName;
            const existingCategory = await ProductCategoryModel.findOne( { catName, $nor: [ { _id: productCategoryId } ] } );
            if ( existingCategory )
            {
                return getErrorResult( res, HttpStatusCode.BadRequest, ADMIN.product_category.alreadAxists );
            }
        }
        if ( catType ) { productcategory.catType = catType; }
        if ( categoryImage )
        {
            const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Appliances' } );
            productcategory.categoryImage = result.secure_url;
        }

        await productcategory.save();

        return getResult( res, HttpStatusCode.Ok, productcategory, ADMIN.product_category.update );
    } catch ( error )
    {
        console.error( "Error in update product category : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.deleteProductCategory = async ( req, res ) =>
{
    try
    {
        const { productCategoryId } = req.params;

        const productcategory = await ProductCategoryModel.findById( productCategoryId );

        if ( !productcategory )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
        }

        await productcategory.deleteOne( { _id: productCategoryId } );

        return getResult( res, HttpStatusCode.Ok, 1, ADMIN.product_category.delete );
    } catch ( error )
    {
        console.error( "Error in delete product category : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};