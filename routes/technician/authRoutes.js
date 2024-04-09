const express = require( 'express' );
const repairReqRouter = require( './repairRoutes' );
const { TechnicianAuthMiddleware } = require( '../../middleware/technician/auth' );
const notificationRouter = require( './notificationRoutes' );
const techAuthRouter = express.Router();

// repair request
techAuthRouter.use( '/', TechnicianAuthMiddleware, repairReqRouter );

// notification
techAuthRouter.use( '/', TechnicianAuthMiddleware, notificationRouter );


module.exports = techAuthRouter;
