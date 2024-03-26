const express = require( 'express' );
const { getAllRepairRequests, assignRepairToTech, acceptOrCancleRepairRequest } = require( '../../controller/admin/repairController' );
const repairReqRouter = express.Router();

repairReqRouter.post( '/getAllRepairRequests', getAllRepairRequests );

// repairReqRouter.post( '/acceptOrCancleRepairRequest/:repairId', acceptOrCancleRepairRequest );

repairReqRouter.post( '/assignRepairToTech', assignRepairToTech );

module.exports = repairReqRouter;