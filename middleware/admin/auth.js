const jwt = require( 'jsonwebtoken' );
const TokenModel = require( '../../models/tokenModel.js' );
const { ERROR } = require( '../../utils/message.js' );
const { HttpStatusCode } = require( '../../utils/code.js' );
const { getErrorResult, getResult } = require( '../../base/baseController.js' );
const config = require( "../../config/config.js" );
const UserModel = require( '../../models/userModel.js' );

module.exports.adminAuthMiddleware = async ( req, res, next ) =>
{
    try
    {
        const tokenWithBearer = req.header( 'Authorization' );
        if ( typeof tokenWithBearer !== 'undefined' )
        {
            const bearer = tokenWithBearer.split( " " );
            const token = bearer[ 1 ];

            if ( !token )
            {
                return getErrorResult( res, HttpStatusCode.Unauthorize, ERROR.headers.deniedToken );
            };
            try
            {
                const decoded = jwt.verify( token, config.jwt.secret_key );
                req.admin = decoded;

                const admin = await UserModel.findById( req.admin.id );
                if ( admin )
                {
                    if ( admin.role === 'Admin' )
                    {
                        const isBlacklisted = await TokenModel.findOne( { userId: admin.id } );
                        if ( isBlacklisted.token === '' )
                        {
                            return getErrorResult( res, HttpStatusCode.Unauthorize, ERROR.headers.blackListToken );
                        }
                        req.admin = admin;
                        next();
                    } else
                    {
                        return getErrorResult( res, HttpStatusCode.Forbidden, ERROR.headers.adminAuth );
                    }
                } else
                {
                    return getErrorResult( res, HttpStatusCode.NotFound, "Admin not found" );
                }
            } catch ( error )
            {
                return getResult( res, HttpStatusCode.BadRequest, error.message, ERROR.headers.accessDenied );
            }
        }
    } catch ( error )
    {
        console.error( "Error in admin middleware  : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};