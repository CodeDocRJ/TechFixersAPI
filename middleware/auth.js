const jwt = require( 'jsonwebtoken' );
const TokenModel = require( '../models/tokenModel.js' );
const { ERROR } = require( '../utils/message.js' );
const { HttpStatusCode } = require( '../utils/code.js' );
const { getErrorResult, getResult } = require( '../base/baseController.js' );
const config = require( "../config/config.js" );

module.exports.tokenAuth = async ( req, res, next ) =>
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

                const userToken = await TokenModel.findOne( { userId: user._id } );
                const expiresInMilliseconds = Date.parse( userToken.expiresIn );
                if ( Date.now() > expiresInMilliseconds )
                {
                    return getErrorResult( res, HttpStatusCode.Unauthorize, ERROR.headers.blackListToken );
                }
                next();
            } catch ( error )
            {
                return getResult( res, HttpStatusCode.BadRequest, error.message, ERROR.headers.accessDenied );
            }
        }
    } catch ( error )
    {
        console.error( "Error in auth middleware  : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};