const { getErrorResult, getResult } = require( "../../base/baseController" );
const RepairCategoryModel = require( "../../models/repairCategoryModel" );
const RepairRequestModel = require( "../../models/repairRequestModel" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN, USER, NOTIFICATION } = require( "../../utils/message" );
const { sendNotificationToSingle, sendNotificationToMultiples } = require( "../../utils/notification" );

const cloudinary = require( 'cloudinary' ).v2;

module.exports.submitRepairRequest = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const { repairCategoryId, issueDescription, requestMode, addressOfRepair, date, time } = req.body;
        const applianceImage = req.file;

        createdValue = {};

        const repairCategory = await RepairCategoryModel.findById( repairCategoryId );
        if ( !repairCategory )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.repair_category.notFound );
        }

        if ( issueDescription ) { createdValue.issueDescription = issueDescription; }
        if ( requestMode ) { createdValue.requestMode = requestMode; }
        if ( date ) { createdValue.date = date; }
        if ( time ) { createdValue.time = time; }
        if ( applianceImage )
        {
            const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Appliances' } );

            createdValue.applianceImage = result.secure_url;
        }
        if ( addressOfRepair && addressOfRepair.houseNumber )
        {
            createdValue.addressOfRepair = {
                ...createdValue.addressOfRepair,
                houseNumber: addressOfRepair.houseNumber
            };
        }
        if ( addressOfRepair && addressOfRepair.streetName )
        {
            createdValue.addressOfRepair = {
                ...createdValue.addressOfRepair,
                streetName: addressOfRepair.streetName
            };
        }
        if ( addressOfRepair && addressOfRepair.city )
        {
            createdValue.addressOfRepair = {
                ...createdValue.addressOfRepair,
                city: addressOfRepair.city
            };
        }
        if ( addressOfRepair && addressOfRepair.postCode )
        {
            createdValue.addressOfRepair = {
                ...createdValue.addressOfRepair,
                postCode: addressOfRepair.postCode
            };
        }

        const submitRepairRequest = new RepairRequestModel( {
            userId: userId,
            repairCategoryId: repairCategoryId,
            ...createdValue
        } );

        await submitRepairRequest.save();

        const admins = await UserModel.find( { role: "Admin" } );
        const adminIds = admins.map( admin => admin._id );

        const notification = await sendNotificationToMultiples( adminIds, "Submit repair request", NOTIFICATION.submit );

        return getResult( res, HttpStatusCode.Ok, { submitRepairRequest, notification }, USER.repair_req.submit );
    } catch ( error )
    {
        console.error( "Error in submit repaire request : ", error );
        return getErrorResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getAllRepairRequests = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const { page = 1, limit = 5 } = req.body;

        const skip = ( page - 1 ) * limit;

        const repairRequests = await RepairRequestModel.find( { status: 'Upcomming', userId: userId } )
            .skip( skip )
            .limit( limit )
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

        return getResult( res, HttpStatusCode.Ok, repairRequests, ADMIN.repair_category.list );
    } catch ( error )
    {
        console.error( "Error in get repair request list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};