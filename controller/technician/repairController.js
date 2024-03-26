const { getResult, getErrorResult } = require( "../../base/baseController" );
const RepairCategoryModel = require( "../../models/repairCategoryModel" );
const RepairRequestModel = require( "../../models/repairRequestModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN, USER } = require( "../../utils/message" );

module.exports.getRepairRequests = async ( req, res ) =>
{
    try
    {
        const techId = req.tech.id;
        // const { techId } = req.body;
        const repairRequests = await RepairRequestModel.find( { techId: techId } ).lean();

        return getResult( res, HttpStatusCode.Ok, repairRequests ? repairRequests : [], ADMIN.repair_category.list );
    } catch ( error )
    {
        console.error( "Error in get repair requests : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.updateRepairStatus = async ( req, res ) =>
{
    try
    {
        const techId = req.tech.id;
        const { price, repairId } = req.body;

        const repairRequest = await RepairRequestModel.findOne( { _id: repairId, techId: techId } );
        if ( !repairRequest )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.repair_req.notFound );
        }

        if ( price )
        {
            const repairCat = await RepairCategoryModel.findOne( { _id: repairRequest.repairCategoryId } );
            if ( !repairCat )
            {
                return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.repair_category.notFound );
            }

            repairCat.approxPrice += price;

            await repairCat.save();
        }

        repairRequest.requestStatus = "Completed";
        await repairRequest.save();

        return getResult( res, HttpStatusCode.Ok, repairRequest, ADMIN.repair_category.status );
    } catch ( error )
    {
        console.error( "Error in update repair request status: ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};  