const { getErrorResult, getResult } = require( "../../base/baseController" );
const OrderModel = require( "../../models/orderModel" );
const ProductModel = require( "../../models/productModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ADMIN, USER, ERROR } = require( "../../utils/message" );

module.exports.submitOrder = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const { firstName, lastName, productId, quantity, address, orderPlaceDateTime } = req.body;

        const product = await ProductModel.findById( productId );
        if ( !product )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.product.notFound );
        }

        const newOrder = new OrderModel( {
            userId,
            firstName,
            lastName,
            productId,
            quantity,
            address,
            orderPlaceDateTime
        } );
        await newOrder.save();

        return getResult( res, HttpStatusCode.Ok, newOrder, USER.order.submit );
    } catch ( error )
    {
        console.error( "Error in submit order : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};