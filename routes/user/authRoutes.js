const express = require( 'express' );
const { userAuthMiddleware } = require( '../../middleware/user/auth' );
const productCategoryRouter = require( './productCategoryRoutes' );
const productRouter = require( './productRoutes' );
const orderRouter = require( './orderRoutes' );
const repairReqRouter = require( './submitRepairRequestRoutes' );
const cardRouter = require( './cardRoutes' );

const userAuthRouter = express.Router();

// product category
userAuthRouter.use( '/', productCategoryRouter );

// product
userAuthRouter.use( '/', productRouter );

// order submit
userAuthRouter.use( '/', userAuthMiddleware, orderRouter );

// repair request submit
userAuthRouter.use( '/', userAuthMiddleware, repairReqRouter );

// card
userAuthRouter.use( '/', userAuthMiddleware, cardRouter );


module.exports = userAuthRouter;
