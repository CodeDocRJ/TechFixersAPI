const jwt = require( 'jsonwebtoken' );
const TokenModel = require( '../../models/tokenModel.js' );
const { ERROR } = require( '../../utils/message.js' );
const { HttpStatusCode } = require( '../../utils/code.js' );
const { getErrorResult, getResult } = require( '../../base/baseController.js' );
const config = require( "../../config/config.js" );
const UserModel = require( '../../models/userModel.js' );

module.exports.TechnicianAuthMiddleware = async ( req, res, next ) =>
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
                req.tech = decoded;

                const tech = await UserModel.findById( req.tech.id );
                if ( tech )
                {
                    if ( tech.role === 'Tech' )
                    {
                        const isBlacklisted = await TokenModel.findOne( { userId: tech._id } );
                        if ( isBlacklisted.token === null )
                        {
                            return getErrorResult( res, HttpStatusCode.Unauthorize, ERROR.headers.blackListToken );
                        }
                        req.tech = tech;
                        next();
                    } else
                    {
                        return getErrorResult( res, HttpStatusCode.Forbidden, ERROR.headers.techAuth );
                    }
                } else
                {
                    return getErrorResult( res, HttpStatusCode.NotFound, "Technician not found" );
                }
            } catch ( error )
            {
                return getResult( res, HttpStatusCode.BadRequest, error.message, ERROR.headers.accessDenied );
            }
        }
    } catch ( error )
    {
        console.error( "Error in technician middleware  : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};