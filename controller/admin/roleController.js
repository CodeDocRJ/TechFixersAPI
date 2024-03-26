const { getResult, getErrorResult } = require( "../../base/baseController" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN } = require( "../../utils/message" );

module.exports.changeRole = async ( req, res ) =>
{
    try
    {
        const { id } = req.params;
        const { role } = req.body;

        const user = await UserModel.findOne( { _id: id } );

        if ( !user )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ERROR.notFound );
        }

        user.role = role;

        if ( role === "Admin" )
        {
            return getErrorResult( res, HttpStatusCode.BadRequest, "Not changed for Admin role" );
        }
        await user.save();

        return getResult( res, HttpStatusCode.Ok, user, ADMIN.role.role );
    } catch ( error )
    {
        console.error( "Error in change role : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};