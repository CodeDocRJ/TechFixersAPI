const express = require( 'express' );
const { getRepairRequests, updateRepairStatus } = require( '../../controller/technician/repairController' );
const repairReqRouter = express.Router();

repairReqRouter.get( '/getRepairRequests', getRepairRequests );

repairReqRouter.post( '/updateRepairStatus', updateRepairStatus );

module.exports = repairReqRouter;