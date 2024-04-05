const { getResult, getErrorResult } = require( "../../base/baseController" );
const RepairCategoryModel = require( "../../models/repairCategoryModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN, USER } = require( "../../utils/message" );

module.exports.getInvoiceDetails = async ( req, res ) =>
{
    try
    {
        const { repairCategoryId } = req.params;

        const repairCategory = await RepairCategoryModel.findById( repairCategoryId );

        if ( !repairCategory )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.repair_category.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, repairCategory, ADMIN.invoice.details );
    } catch ( error )
    {
        console.error( "Error in fetch invoice details : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};