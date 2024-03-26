const { getErrorResult, getResult } = require( "../../base/baseController" );
const RepairCategoryModel = require( "../../models/repairCategoryModel" );
const RepairRequestModel = require( "../../models/repairRequestModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN, USER } = require( "../../utils/message" );

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

        return getResult( res, HttpStatusCode.Ok, submitRepairRequest, USER.repair_req.submit );
    } catch ( error )
    {
        console.error( "Error in submit repaire request : ", error );
        return getErrorResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};