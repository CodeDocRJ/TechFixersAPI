const config = require( "../config/config" );
const Jwt = require( "jsonwebtoken" );
const bcrypt = require( 'bcrypt' );

exports.generateAccessToken = ( data ) =>
{
    return Jwt.sign(
        { id: data.id },
        config.jwt.secret_key,
        {
            expiresIn: 5 * 100000
        }
    );
};

exports.generateHashPwd = async ( password ) =>
{
    try
    {
        const hashedPwd = await bcrypt.hash( password, 10 );

        return hashedPwd;
    } catch ( error )
    {
        console.error( "Error in generate hash password : ", error );
    }
};

exports.comparePwd = async ( Pwd, hashedPwd ) =>
{
    try
    {
        const passwordMatch = await bcrypt.compare( Pwd, hashedPwd );

        return passwordMatch;
    } catch ( error )
    {
        console.error( "Error in generate hash password : ", error );
    }
};