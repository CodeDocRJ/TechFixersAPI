const express = require( 'express' );
const { userAuthMiddleware } = require( '../../middleware/user/auth' );
const productCategoryRouter = require( './productCategoryRoutes' );
const productRouter = require( './productRoutes' );
const orderRouter = require( './orderRoutes' );
const repairReqRouter = require( './submitRepairRequestRoutes' );

const userAuthRouter = express.Router();

// product category
userAuthRouter.use( '/', productCategoryRouter );

// product
userAuthRouter.use( '/', productRouter );

// order submit
userAuthRouter.use( '/', userAuthMiddleware, orderRouter );

// repair request submit
userAuthRouter.use( '/', userAuthMiddleware, repairReqRouter );

module.exports = userAuthRouter;
