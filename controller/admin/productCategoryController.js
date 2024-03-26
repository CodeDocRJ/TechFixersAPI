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
