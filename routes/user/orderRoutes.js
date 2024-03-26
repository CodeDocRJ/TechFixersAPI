const express = require( 'express' );
const { submitOrder } = require( '../../controller/user/orderController' );
const orderRouter = express.Router();

orderRouter.post( '/submitOrder', submitOrder );

module.exports = orderRouter;