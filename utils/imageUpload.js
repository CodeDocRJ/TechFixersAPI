const multer = require( 'multer' );
const { CloudinaryStorage } = require( 'multer-storage-cloudinary' );
const cloudinary = require( 'cloudinary' ).v2;

cloudinary.config( {
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
} );

const storage = multer.diskStorage( {} );

module.exports.uploadprofileImage = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: ( req, file, cb ) =>
    {
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
            cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
    }
} ).single( 'profileImage' );

module.exports.uploadcategoryImage = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: ( req, file, cb ) =>
    {
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
            cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
    }
} ).single( 'categoryImage' );

module.exports.uploadproductImage = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: ( req, file, cb ) =>
    {
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
            cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
    }
} ).single( 'productImage' );

module.exports.uploadapplianceImage = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: ( req, file, cb ) =>
    {
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
            cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
    }
} ).single( 'applianceImage' );