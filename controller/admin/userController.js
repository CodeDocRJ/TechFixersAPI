const { getResult, getErrorResult } = require( "../../base/baseController" );
const UserModel = require( "../../models/userModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, ADMIN } = require( "../../utils/message" );

module.exports.getUserList = async ( req, res ) =>
{
    try
    {
        const users = await UserModel.find( { role: "User" } );

        if ( users.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ADMIN.user.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, users, ADMIN.user.list );
    } catch ( error )
    {
        console.error( "Error in get user list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};