const express = require( 'express' );
const router = express.Router();

const authController = require( "../controller/authController.js" );
const authMiddleware = require( '../middleware/auth.js' );
const { uploadprofileImage } = require( '../utils/imageUpload.js' );


// Username available
router.get( '/check-username/:username', authController.checkUsername );

// User Signup
router.post( '/signup', uploadprofileImage, authController.signup );

// User Login
router.post( '/login', uploadprofileImage, authController.login );

// // Forgot Password
router.post( '/forgotPassword', authController.forgotPassword );

// User Profile
router.get( '/getProfile', authMiddleware.tokenAuth, authController.getProfile );

// User Update Profile
router.post( '/updateProfile', uploadprofileImage, authMiddleware.tokenAuth, authController.updateProfile );

// User Logout
router.post( '/logOut', authMiddleware.tokenAuth, authController.logOut );

// Notification
// router.post( '/notification', authController.sendNotification );


module.exports = router;
// export default router;