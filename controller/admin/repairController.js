const { getResult, getErrorResult } = require( "../../base/baseController" );
const RepairRequestModel = require( "../../models/repairRequestModel" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN, USER } = require( "../../utils/message" );

module.exports.getAllRepairRequests = async ( req, res ) =>
{
    try
    {
        const { page = 1, limit = 5, sort } = req.body;

        const skip = ( page - 1 ) * limit;

        const sort_direction = sort === 'Ascending' ? 1 : -1;

        const repairRequests = await RepairRequestModel.find( { status: "Submitted" } )
            .sort( { createdAt: sort_direction } )
            .skip( skip )
            .limit( limit )
            .lean();

        return getResult( res, HttpStatusCode.Ok, repairRequests ? repairRequests : [], ADMIN.repair_category.list );
    } catch ( error )
    {
        console.error( "Error in get repair request list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

// module.exports.acceptOrCancleRepairRequest = async ( req, res ) =>
// {
//     try
//     {
//         const { repairId } = req.params;
//         const { isAccept } = req.body;

//         const repairRequest = await RepairRequestModel.findById( repairId );
//         if ( !repairRequest )
//         {
//             return getErrorResult( res, HttpStatusCode.NotFound, USER.repair_req.notFound );
//         }

//         if ( isAccept !== undefined )
//         {
//             if ( isAccept === true )
//             {
//                 repairRequest.requestStatus = "Assigned";

//                 await repairRequest.save();
//                 return getResult( res, HttpStatusCode.Ok, repairRequest, USER.repair_req.assign );
//             } else
//             {
//                 repairRequest.requestStatus = "Cancelled";

//                 await repairRequest.save();
//                 return getResult( res, HttpStatusCode.Ok, { request_status: isAccept }, USER.repair_req.cancle );
//             }
//         }
//     } catch ( error )
//     {
//         console.error( "Error in accet or cancle repair request : ", error );
//         return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
//     }
// };

module.exports.assignRepairToTech = async ( req, res ) =>
{
    try
    {
        const { repairId, userId, techId, isAccept } = req.body;

        const repairRequest = await RepairRequestModel.findOne( { _id: repairId, userId: userId } );
        if ( !repairRequest )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.repair_req.notFound );
        }

        const tech = await UserModel.findOne( { _id: techId, role: 'Tech' } );
        if ( !tech )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, "Technician not found" );
        }

        if ( isAccept !== undefined )
        {
            if ( isAccept === true )
            {
                repairRequest.techId = techId;
                repairRequest.requestStatus = "Assigned";

                await repairRequest.save();
                return getResult( res, HttpStatusCode.Ok, repairRequest, USER.repair_req.assign );
            } else
            {
                repairRequest.requestStatus = "Cancelled";

                await repairRequest.save();
                return getResult( res, HttpStatusCode.Ok, { request_status: isAccept }, USER.repair_req.cancle );
            }
        }

    } catch ( error )
    {
        console.error( "Error in assign repair to tech : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};