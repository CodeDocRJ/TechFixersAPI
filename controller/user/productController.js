const { getResult, getErrorResult } = require( "../../base/baseController" );
const ProductCategoryModel = require( "../../models/productCategoryModel" );
const ProductModel = require( "../../models/productModel" );
const RepairCategoryModel = require( "../../models/repairCategoryModel" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ADMIN, ERROR } = require( "../../utils/message" );

module.exports.getProductList = async ( req, res ) =>
{
    try
    {
        const categoryId = req.params.categoryId;

        const category = await ProductCategoryModel.findById( categoryId );
        if ( !category )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product_category.notFound );
        }

        const products = await ProductModel.find( { categoryId: categoryId } ).lean();

        if ( products.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product.notFound );
        }

        const data = {
            ProductCount: products.length,
            products: products
        };

        return getResult( res, HttpStatusCode.Ok, data, ADMIN.product.list );
    } catch ( error )
    {
        console.error( "Error in get product list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getProduct = async ( req, res ) =>
{
    try
    {
        const productId = req.params.productId;
        const product = await ProductModel.findById( productId );

        if ( !product )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, product, ADMIN.product.get );
    } catch ( error )
    {
        console.error( "Error in get product : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

// module.exports.getRepairCategories = async ( req, res ) =>
// {
//     try
//     {
//         const repairCategories = await RepairCategoryModel.find();

//         if ( repairCategories.length === 0 )
//         {
//             return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.repair_category.notFound );
//         }

//         return getResult( res, HttpStatusCode.Ok, repairCategories, ADMIN.repair_category.list );
//     } catch ( error )
//     {
//         console.error( "Error in get repair categories : ", error );
//         return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
//     }
// };