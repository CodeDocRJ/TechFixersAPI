const express = require( 'express' );
const { getOrderList } = require( '../../controller/admin/orderController' );
const orderRouter = express.Router();

orderRouter.get( '/getOrderList', getOrderList );

module.exports = orderRouter;