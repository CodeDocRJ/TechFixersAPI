const express = require( 'express' );
const { getInvoiceDetails } = require( '../../controller/admin/invoicedetailsController' );
const invoiceDetailRouter = express.Router();

invoiceDetailRouter.get( '/getInvoiceDetails/:repairCategoryId', getInvoiceDetails );

module.exports = invoiceDetailRouter;