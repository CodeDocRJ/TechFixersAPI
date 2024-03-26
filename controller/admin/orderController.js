const { getErrorResult, getResult } = require( "../../base/baseController" );
const OrderModel = require( "../../models/orderModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ADMIN, USER, ERROR } = require( "../../utils/message" );

module.exports.getOrderList = async ( req, res ) =>
{
    try
    {
        const orders = await OrderModel.find();

        return getResult( res, HttpStatusCode.Ok, orders ? orders : [], USER.order.list );

    } catch ( error )
    {
        console.error( "Error in order list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};