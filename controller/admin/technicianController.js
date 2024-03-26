const { getResult, getErrorResult } = require( "../../base/baseController" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN } = require( "../../utils/message" );

module.exports.getTechnicianList = async ( req, res ) =>
{
    try
    {
        const technicians = await UserModel.find( { role: "Tech" } );

        if ( technicians.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.technician.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, technicians, ADMIN.technician.list );
    } catch ( error )
    {
        console.error( "Error in get technician list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};