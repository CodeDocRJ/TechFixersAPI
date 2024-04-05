const express = require( 'express' );
const { submitRepairRequest, getAllRepairRequests } = require( '../../controller/user/submitRepairReqController' );
const { uploadapplianceImage } = require( '../../utils/imageUpload' );
const repairReqRouter = express.Router();

repairReqRouter.post( '/submitRepairRequest', uploadapplianceImage, submitRepairRequest );

repairReqRouter.post( '/getRepairRequestList', getAllRepairRequests );

module.exports = repairReqRouter;