const { getErrorResult, getResult } = require( "../../base/baseController" );
const RepairCategoryModel = require( "../../models/repairCategoryModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN } = require( "../../utils/message" );


module.exports.getRepairCategories = async ( req, res ) =>
{
    try
    {
        const repairCategories = await RepairCategoryModel.find();

        return getResult( res, HttpStatusCode.Ok, repairCategories ? repairCategories : [], ADMIN.repair_category.list );
    } catch ( error )
    {
        console.error( "Error in get repair categories : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};
