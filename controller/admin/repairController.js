const { getResult, getErrorResult } = require( "../../base/baseController" );
const RepairRequestModel = require( "../../models/repairRequestModel" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN, USER, NOTIFICATION } = require( "../../utils/message" );
const { sendNotificationToSingle } = require( "../../utils/notification" );

module.exports.getAllRepairRequests = async ( req, res ) =>
{
    try
    {
        const { page = 1, limit = 5, sort } = req.body;

        const skip = ( page - 1 ) * limit;

        const sort_direction = sort === 'Descending' ? -1 : 1;

        const repairRequests = await RepairRequestModel.find( { status: "Upcomming" } )
            .sort( { createdAt: sort_direction } )
            .skip( skip )
            .limit( limit )
            .populate( {
                path: "userId",
                select: "userName email phone firstName lastName"
            } )
            .populate( {
                path: "repairCategoryId",
                select: "applianceName"
            } )
            .lean()
            .exec();

        if ( repairRequests.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.repair_req.notFound );
        }

        const modifiedRepairRequests = repairRequests.map( request => ( {
            ...request,
            userData: request.userId,
            repairCategoryData: request.repairCategoryId,
        } ) );

        modifiedRepairRequests.forEach( request =>
        {
            delete request.userId;
            delete request.repairCategoryId;
        } );

        return getResult( res, HttpStatusCode.Ok, modifiedRepairRequests, ADMIN.repair_category.list );
    } catch ( error )
    {
        console.error( "Error in get repair request list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.acceptOrCancleRepairRequest = async ( req, res ) =>
{
    try
    {
        const { repairId } = req.params;
        const { isAccept } = req.body;

        const repairRequest = await RepairRequestModel.findById( repairId );
        if ( !repairRequest )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.repair_req.notFound );
        }

        if ( isAccept !== undefined )
        {
            if ( isAccept === true )
            {
                repairRequest.requestStatus = "Accepted";
                repairRequest.status = "Upcomming";

                await repairRequest.save();

                const user = await UserModel.findOne( { _id: repairRequest.userId, role: "User" } );

                const notification = await sendNotificationToSingle( user._id, "Accept request", NOTIFICATION.accepted );

                return getResult( res, HttpStatusCode.Ok, { repairRequest, notification }, USER.repair_req.accept );
            } else
            {
                repairRequest.requestStatus = "Cancelled";
                repairRequest.status = "Cancelled";

                await repairRequest.save();

                const user = await UserModel.findOne( { _id: repairRequest.userId, role: "User" } );

                const notification = await sendNotificationToSingle( user._id, "Cancle request", NOTIFICATION.cancle );

                return getResult( res, HttpStatusCode.Ok, { request_status: isAccept, notification }, USER.repair_req.cancle );
            }
        }
    } catch ( error )
    {
        console.error( "Error in accet or cancle repair request : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.assignRepairToTech = async ( req, res ) =>
{
    try
    {
        const { repairId, userId, techId } = req.body;

        const repairRequest = await RepairRequestModel.findOne( { _id: repairId, userId: userId, requestStatus: 'Accepted' } );
        if ( !repairRequest )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.repair_req.notFound );
        }

        const tech = await UserModel.findOne( { _id: techId, role: 'Tech' } );
        if ( !tech )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, "Technician not found" );
        }

        if ( repairRequest.requestStatus === "Assigned" )
        {
            return getErrorResult( res, HttpStatusCode.BadRequest, "Repair request already assigned" );
        }
        repairRequest.techId = techId;
        repairRequest.requestStatus = "Assigned";

        await repairRequest.save();

        const technician = await UserModel.findOne( { _id: techId, role: "Tech" } );

        const notification = await sendNotificationToSingle( technician._id, "Assign request", NOTIFICATION.assign );

        return getResult( res, HttpStatusCode.Ok, { repairRequest, notification }, USER.repair_req.assign );

    } catch ( error )
    {
        console.error( "Error in assign repair to tech : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.verifyServiceRepairReqMode = async ( req, res ) =>
{
    try
    {
        const { repairId } = req.params;
        const { requestMode } = req.body;

        const repairRequest = await RepairRequestModel.findById( repairId );
        if ( !repairRequest )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, USER.repair_req.notFound );
        }

        if ( requestMode !== 'Remote', requestMode !== 'In Person', requestMode !== 'At Home' )
        {
            return getErrorResult( res, HttpStatusCode.Unauthorize, USER.repair_req.invalid );
        }

        repairRequest.requestMode = requestMode;
        await repairRequest.save();

        return getResult( res, HttpStatusCode.Ok, repairRequest, USER.repair_req.mode );
    } catch ( error )
    {
        console.error( "Error in update request mode repair request : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};