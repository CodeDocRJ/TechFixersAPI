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
        console.log( `uploadprofileImage mime type is==> ${ file.mimetype } ` );
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
        //     cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
        cb( null, true );
    }
} ).single( 'profileImage' );

module.exports.uploadcategoryImage = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: ( req, file, cb ) =>
    {
        console.log( `uploadcategoryImage mime type is==> ${ file.mimetype } ` );
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
        //     cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
        cb( null, true );
    }
} ).single( 'categoryImage' );

module.exports.uploadproductImage = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: ( req, file, cb ) =>
    {
        console.log( `uploadproductImage mime type is==> ${ file.mimetype } ` );
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
        //     cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
        cb( null, true );
    }
} ).single( 'productImage' );

module.exports.uploadapplianceImage = multer( {
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: ( req, file, cb ) =>
    {
        console.log( `uploadapplianceImage mime type is==> ${ file.mimetype } ` );
        // if ( file.mimetype === 'image/png' || file.mimetype === 'image/jpeg' )
        // {
        //     cb( null, true );
        // } else
        // {
        //     cb( new Error( 'Only PNG and JPEG images are allowed' ) );
        // }
        cb( null, true );
    }
} ).single( 'applianceImage' );