const { getResult, getErrorResult } = require( "../../base/baseController" );
const ProductCategoryModel = require( "../../models/productCategoryModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ADMIN, ERROR, USER } = require( "../../utils/message" );

module.exports.getProductCategory = async ( req, res ) =>
{
    try
    {
        const categories = await ProductCategoryModel.find( {}, '_id catName catType categoryImage' );

        if ( !categories )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, categories, USER.product_category.list );
    } catch ( error )
    {
        console.error( "Error in get product category : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};
