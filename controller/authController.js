const UserModel = require( '../models/userModel' );
const TokenModel = require( '../models/tokenModel' );
const { getResult, getErrorResult } = require( '../base/baseController' );
const { HttpStatusCode } = require( '../utils/code' );
const { ERROR, user_name, auth } = require( '../utils/message' );
const { generateHashPwd, generateAccessToken, comparePwd } = require( '../utils/authHelper' );

const nodemailer = require( 'nodemailer' );
const config = require( '../config/config' );

const cloudinary = require( 'cloudinary' ).v2;

module.exports.checkUsername = async ( req, res ) =>
{
    try
    {
        const { username } = req.params;

        const existingUser = await UserModel.findOne( { userName: username } );
        if ( existingUser )
        {
            return getResult( res, HttpStatusCode.BadRequest, { exists: true }, user_name.userNameAlreadAxists );
        } else
        {
            return getResult( res, HttpStatusCode.Ok, { exists: false }, user_name.available );
        }
    } catch ( error )
    {
        console.error( "Error in check user name : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.signup = async ( req, res ) =>
{
    try
    {
        const { userName, email, password, phone, role, dateOfBirth, address, isVerified } = req.body;

        let profileImage = req.file;

        let createdValue = {};

        const existingUser = await UserModel.findOne( { email } );
        if ( existingUser )
        {
            return getErrorResult( res, HttpStatusCode.Unauthorize, ERROR.alreadAxists );
        }

        const hashedPassword = await generateHashPwd( password );

        if ( dateOfBirth ) { createdValue.dateOfBirth = dateOfBirth; }
        if ( address && address.houseNumber )
        {
            createdValue.address = {
                ...createdValue.address,
                houseNumber: address.houseNumber
            };
        }
        if ( address && address.streetName )
        {
            createdValue.address = {
                ...createdValue.address,
                streetName: address.streetName
            };
        }
        if ( address && address.city )
        {
            createdValue.address = {
                ...createdValue.address,
                city: address.city
            };
        }
        if ( address && address.postCode )
        {
            createdValue.address = {
                ...createdValue.address,
                postCode: address.postCode
            };
        }
        if ( isVerified ) { createdValue.isVerified = isVerified; }
        if ( profileImage )
        {
            const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Appliances' } );

            createdValue.profileImage = result.secure_url;
        }

        const newUser = new UserModel( {
            userName,
            email,
            password: hashedPassword,
            phone,
            role,
            ...createdValue
        } );
        await newUser.save();

        return getResult( res, HttpStatusCode.BadRequest, newUser, `${ role ? role : "User" } created successfully` );
    } catch ( error )
    {
        console.error( "Error in signup : ", error );
        if ( error.code === 11000 && error.keyPattern.userName )
        {
            return getResult( res, HttpStatusCode.BadRequest, error.message, user_name.userNameAlreadAxists );
        } else if ( error.code === 11000 && error.keyPattern.email )
        {
            return getResult( res, HttpStatusCode.BadRequest, error.message, user_name.emailAlreadAxists );
        } else if ( error.code === 11000 && error.keyPattern.phone )
        {
            return getResult( res, HttpStatusCode.BadRequest, error.message, user_name.phoneAlreadAxists );
        } else
        {
            return getResult( res, HttpStatusCode.BadRequest, error.message, ERROR.internalServerError );
        }
    }
};

module.exports.login = async ( req, res ) =>
{
    try
    {
        const { emailOrUsername, password } = req.body;

        let role = await UserModel.findOne( { email: emailOrUsername } );

        if ( !role )
        {
            role = await UserModel.findOne( { userName: emailOrUsername } );
        }
        if ( !role )
        {
            // res.status( 401 ).json( {
            //     responseCode: 401,
            //     responseMessage: 'User not found with this email or username',
            // } ).send();
            return getErrorResult( res, HttpStatusCode.NotFound, ERROR.notFound );
        }

        const validPassword = await comparePwd( password, role.password );
        if ( !validPassword )
        {
            // return res.status( 401 ).json( { message: 'Invalid credentials' } );
            return getErrorResult( res, HttpStatusCode.Unauthorize, ERROR.invalid );
        }

        const generateToken = generateAccessToken( role );

        const existingToken = await TokenModel.findOne( { userId: role._id } );

        if ( existingToken )
        {
            existingToken.token = generateToken;
            await existingToken.save();
        } else
        {
            const roleToken = new TokenModel( {
                userId: role._id,
                token: generateToken
            } );
            await roleToken.save();
        }

        return getResult( res, HttpStatusCode.Ok, { [ role.role ]: role, accessToken: generateToken }, auth.login );
    } catch ( error )
    {
        console.error( "Error in login : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getProfile = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        // const user_id = req.params;

        // if ( userId !== user_id )
        // {
        //     return getErrorResult( res, HttpStatusCode.NotFound, ERROR.notFound );
        // }

        const role = await UserModel.findById( userId );
        if ( !role )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ERROR.notFound );
        }

        const token = await req.header( 'Authorization' ).replace( 'Bearer ', '' );

        return getResult( res, HttpStatusCode.Ok, { [ role.role ]: role, token }, auth.getProfile );
    } catch ( error )
    {
        console.error( "Error in get profile : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.updateProfile = async ( req, res ) =>    
{
    try
    {
        const { userName, password, phone, dateOfBirth, address, role, isVerified, firstName, lastName } = req.body;
        const userId = req.user.id; // Extract userId from request parameters
        const profileImage = req.file;

        // Find the user by userId
        const user = await UserModel.findById( userId );
        if ( !user )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, ERROR.notFound );
        }

        user.userName = userName ? userName : user.userName;
        user.password = password ? await generateHashPwd( password ) : user.password;
        user.phone = phone ? phone : user.phone;
        user.dateOfBirth = dateOfBirth ? dateOfBirth : user.dateOfBirth;
        if ( address && address.houseNumber )
        {
            user.address = {
                ...user.address,
                houseNumber: address.houseNumber
            };
        }
        if ( address && address.streetName )
        {
            user.address = {
                ...user.address,
                streetName: address.streetName
            };
        }
        if ( address && address.city )
        {
            user.address = {
                ...user.address,
                city: address.city
            };
        }
        if ( address && address.postCode )
        {
            user.address = {
                ...user.address,
                postCode: address.postCode
            };
        }
        user.role = role === "User" || role === "Tech" ? role : user.role;
        user.isVerified = isVerified ? isVerified : user.isVerified;
        user.firstName = firstName ? firstName : user.firstName;
        user.lastName = lastName ? lastName : user.lastName;

        if ( profileImage )
        {
            const result = await cloudinary.uploader.upload( req.file.path, { folder: 'Appliances' } );

            user.profileImage = result.secure_url || user.profileImage;
        }

        await user.save();

        return getResult( res, HttpStatusCode.Ok, { [ user.role ]: user }, auth.updateProfile );
    } catch ( error )
    {
        console.error( "Error in get profile : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.logOut = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;

        const isToken = await TokenModel.findOne( { userId: userId } );

        isToken.token = null;

        await isToken.save();

        return getErrorResult( res, HttpStatusCode.Ok, auth.logout );
    } catch ( error )
    {
        console.error( "Error in logout : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.forgotPassword = async ( req, res ) =>
{
    try
    {
        const { email } = req.body;

        const transporter = nodemailer.createTransport( {
            service: 'gmail',
            auth: {
                user: `${ config.nodemailer.user }`, // email address
                pass: `${ config.nodemailer.password }`, // email password
            },
        } );

        const mailOptions = {
            from: `${ config.nodemailer.user }`,
            to: email,
            subject: 'Password Reset',
            html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        };

        console.log( "mailOptions: ", mailOptions );
        // Send email
        console.log( "transporter: ", transporter );
        transporter.sendMail( mailOptions, ( error, info ) =>
        {
            if ( error )
            {
                console.error( "Error in send mail : ", error );
                return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
            } else
            {
                console.log( 'Email sent: ' + info.response );
                return getResult( res, HttpStatusCode.Ok, 1, "Password reset email sent successfully" );
            }
        } );
    } catch ( error )
    {
        console.error( "Error in forgot pwd : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};
