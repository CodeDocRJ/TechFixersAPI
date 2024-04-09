const express = require( 'express' );
const { getInvoiceDetails } = require( '../../controller/admin/invoiceDetailsController' );
const invoiceDetailRouter = express.Router();

invoiceDetailRouter.get( '/getInvoiceDetails/:repairCategoryId', getInvoiceDetails );

module.exports = invoiceDetailRouter;