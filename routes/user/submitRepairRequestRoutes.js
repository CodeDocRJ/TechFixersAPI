const express = require( 'express' );
const { submitRepairRequest } = require( '../../controller/user/submitRepairReqController' );
const { uploadapplianceImage } = require( '../../utils/imageUpload' );
const repairReqRouter = express.Router();

repairReqRouter.post( '/submitRepairRequest', uploadapplianceImage, submitRepairRequest );

module.exports = repairReqRouter;