const { getErrorResult, getResult } = require( "../../base/baseController" );
const OrderModel = require( "../../models/orderModel" );
const ProductModel = require( "../../models/productModel" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ADMIN, USER, ERROR, NOTIFICATION } = require( "../../utils/message" );
const { sendNotificationToMultiples } = require( "../../utils/notification" );

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

        const admins = await UserModel.find( { role: "Admin" } );
        const adminIds = admins.map( admin => admin._id );

        const notification = await sendNotificationToMultiples( adminIds, "Submit order", NOTIFICATION.order );

        return getResult( res, HttpStatusCode.Ok, { newOrder, notification }, USER.order.submit );
    } catch ( error )
    {
        console.error( "Error in submit order : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};