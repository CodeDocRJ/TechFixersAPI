const jwt = require( 'jsonwebtoken' );
const TokenModel = require( '../../models/tokenModel.js' );
const { ERROR } = require( '../../utils/message.js' );
const { HttpStatusCode } = require( '../../utils/code.js' );
const { getErrorResult, getResult } = require( '../../base/baseController.js' );
const config = require( "../../config/config.js" );
const UserModel = require( '../../models/userModel.js' );

module.exports.userAuthMiddleware = async ( req, res, next ) =>
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
                req.user = decoded;

                const user = await UserModel.findById( req.user.id );
                if ( user )
                {
                    if ( user.role === 'User' )
                    {
                        const isBlacklisted = await TokenModel.findOne( { userId: user.id } );
                        if ( isBlacklisted.token === null )
                        {
                            return getErrorResult( res, HttpStatusCode.Unauthorize, ERROR.headers.blackListToken );
                        }
                        req.user = user;
                        next();
                    } else
                    {
                        return getErrorResult( res, HttpStatusCode.Forbidden, ERROR.headers.userAuth );
                    }
                } else
                {
                    return getErrorResult( res, HttpStatusCode.NotFound, ERROR.notFound );
                }
            } catch ( error )
            {
                return getResult( res, HttpStatusCode.BadRequest, error.message, ERROR.headers.accessDenied );
            }
        }
    } catch ( error )
    {
        console.error( "Error in user middleware  : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};