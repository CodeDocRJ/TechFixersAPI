const express = require( 'express' );
const productCategoryRouter = require( './productCategoryRoutes' );
const { adminAuthMiddleware } = require( '../../middleware/admin/auth' );
const technicianRouter = require( './technicianRoutes' );
const productRouter = require( './productRoutes' );
const userRouter = require( './userRoutes' );
const roleRouter = require( './roleRoutes' );
const orderRouter = require( './orderRoutes' );
const repairCategoryRouter = require( './repairCategoryRoutes' );
const repairReqRouter = require( './repairRoutes' );

const adminAuthRouter = express.Router();

// product category
adminAuthRouter.use( '/', adminAuthMiddleware, productCategoryRouter );

// technician
adminAuthRouter.use( '/', adminAuthMiddleware, technicianRouter );

// product
adminAuthRouter.use( '/', adminAuthMiddleware, productRouter );

// user
adminAuthRouter.use( '/', adminAuthMiddleware, userRouter );

// role
adminAuthRouter.use( '/', adminAuthMiddleware, roleRouter );

// order
adminAuthRouter.use( '/', adminAuthMiddleware, orderRouter );

// repair category
adminAuthRouter.use( '/', adminAuthMiddleware, repairCategoryRouter );

// repair request
adminAuthRouter.use( '/', adminAuthMiddleware, repairReqRouter );

module.exports = adminAuthRouter;