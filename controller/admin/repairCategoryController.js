const { getErrorResult, getResult } = require( "../../base/baseController" );
const RepairCategoryModel = require( "../../models/repairCategoryModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN } = require( "../../utils/message" );

const cloudinary = require( 'cloudinary' ).v2;

module.exports.addRepairCategory = async ( req, res ) =>
{
    try
    {
        const { applianceName, approxPrice } = req.body;

        const isRepaircategory = await RepairCategoryModel.find( { applianceName: applianceName } );

        if ( isRepaircategory )
        {
            return getErrorResult( res, HttpStatusCode.BadRequest, ADMIN.repair_category.alreadAxists );
        }

        const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Products' } );

        const addRepairCategory = new RepairCategoryModel( {
            applianceName, applianceImage: result.secure_url, approxPrice
        } );
        await addRepairCategory.save();

        return getResult( res, HttpStatusCode.Ok, addRepairCategory, ADMIN.repair_category.added );
    } catch ( error )
    {
        console.error( "Error in add repair category : ", error );
        return getErrorResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getRepairCategoryList = async ( req, res ) =>
{
    try
    {
        const repairCategories = await RepairCategoryModel.find().lean();

        return getResult( res, HttpStatusCode.Ok, repairCategories ? repairCategories : [], ADMIN.repair_category.list );
    } catch ( error )
    {
        console.error( "Error in get repair category list : ", error );
        return getErrorResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getRepairCategory = async ( req, res ) =>
{
    try
    {
        const { repairCategoryId } = req.params;

        const repairCategory = await RepairCategoryModel.findById( repairCategoryId );

        // if ( !repairCategory )
        // {
        //     return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.repair_category.notFound );
        // }

        return getResult( res, HttpStatusCode.Ok, repairCategory ? repairCategory : [], ADMIN.repair_category.get );
    } catch ( error )
    {
        console.error( "Error in get repair category : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.updateRepairCategory = async ( req, res ) =>
{
    try
    {
        const { repairCategoryId } = req.params;
        const { applianceName, approxPrice } = req.body;
        const applianceImage = req.file;

        let validationCondition = { _id: { $ne: repairCategoryId } };

        const repairCategory = await RepairCategoryModel.findById( repairCategoryId );

        if ( !repairCategory )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.repair_category.notFound );
        }

        if ( applianceName )
        {
            validationCondition.applianceName = applianceName;
            const isRepaircategory = await RepairCategoryModel.findOne( validationCondition );

            if ( isRepaircategory )
            {
                return getErrorResult( res, HttpStatusCode.BadRequest, ADMIN.repair_category.alreadAxists );
            }

            repairCategory.applianceName = applianceName;
        }
        if ( approxPrice ) { repairCategory.approxPrice = approxPrice; }

        if ( applianceImage )
        {
            const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Products' } );
            repairCategory.applianceImage = result.secure_url;
        }

        await repairCategory.save();

        return getResult( res, HttpStatusCode.Ok, repairCategory, ADMIN.repair_category.update );
    } catch ( error )
    {
        console.error( "Error in update repair category : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.deleteRepairCategory = async ( req, res ) =>
{
    try
    {
        const { repairCategoryId } = req.params;

        const repairCategory = await RepairCategoryModel.findById( repairCategoryId );

        if ( !repairCategory )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.repair_category.notFound );
        }

        await repairCategory.deleteOne();

        return getResult( res, HttpStatusCode.Ok, 1, ADMIN.repair_category.delete );
    } catch ( error )
    {
        console.error( "Error in delete repair category : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};