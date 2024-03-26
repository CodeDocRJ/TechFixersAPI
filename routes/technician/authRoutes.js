const express = require( 'express' );
const repairReqRouter = require( './repairRoutes' );
const { TechnicianAuthMiddleware } = require( '../../middleware/technician/auth' );
const techAuthRouter = express.Router();

// repair request
techAuthRouter.use( '/', TechnicianAuthMiddleware, repairReqRouter );


module.exports = techAuthRouter;
