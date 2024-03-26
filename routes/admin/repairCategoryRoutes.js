const express = require( 'express' );
const { uploadapplianceImage } = require( '../../utils/imageUpload' );
const { addRepairCategory, getRepairCategoryList, getRepairCategory, updateRepairCategory, deleteRepairCategory } = require( '../../controller/admin/repairCategoryController' );
const repairCategoryRouter = express.Router();

repairCategoryRouter.post( '/addRepairCategory', uploadapplianceImage, addRepairCategory );

repairCategoryRouter.get( '/getRepairCategoryList', getRepairCategoryList );

repairCategoryRouter.get( '/getRepairCategory/:repairCategoryId', getRepairCategory );

repairCategoryRouter.put( '/updateRepairCategory/:repairCategoryId', uploadapplianceImage, updateRepairCategory );

repairCategoryRouter.delete( '/deleteRepairCategory/:repairCategoryId', deleteRepairCategory );

module.exports = repairCategoryRouter;