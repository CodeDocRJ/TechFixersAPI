const express = require('express');
const router = express.Router();

const userController = require("../controller/userController.js");
const authMiddleware = require('../utils/auth.js');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET
});

// Middleware to extract userId from request parameters
const extractUserId = (req, res, next) => {
  req.userId = req.params.userId; // Assuming userId is in the request parameters
  next();
};
// Dynamic folder name based on user ID
const setupStorage = (extractUserId) => {
  console.log('Setting up extractUserId ', extractUserId);

  const folderName = `profile-pictures/user-${extractUserId}`;
  console.log('Setting up folderName ', folderName);

  return new CloudinaryStorage({
    cloudinary: cloudinary,
    // folder: folderName,
    // allowedFormats: ['jpg', 'jpeg', 'png'],
    params: {
      folder: folderName,
      allowedFormats: ['jpeg', 'png', 'jpg'],
    },
    filename: function (req, file, cb) {
      cb(null, new Date().toISOString() + file.originalname);
    }
  });
};

// Multer setup with Cloudinary storage
const upload = multer({ storage: setupStorage('65d3b407415c77d13a01e36a') }); // Provide a sample user ID

// const nodemailer = require('nodemailer');
// const multer = require('multer');
// const path = require('path');

// const UserModel = require('../models/userModel');
// const AccessoryModel = require('../models/accessoryModel');

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/');
//   },
//   filename: function (req, file, cb) {
//     cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
//   }
// });

// const upload = multer({ storage: storage });



// Username available
router.get('/check-username/:username', userController.checkUsername);

// User Signup
router.post('/signup', upload.none(), userController.signupUser);

// User Login
router.post('/login', upload.none(), userController.loginUser);

// Forgot Password
router.post('forgotPassword', userController.forgotPassword);

// User Profile
router.get('/getProfile/:userId', authMiddleware, userController.getProfile);

// User Update Profile
router.post('/updateProfile/:userId', extractUserId, upload.single('profileImage'), authMiddleware, userController.updateProfile);

// User Logout
router.get('/logOut/', authMiddleware, userController.userLogOut);

// User Update
router.put('userUpdate/:userId', userController.updateUser);

// get product categories
router.get('/getProductCategory', userController.getProductCategory);

// Get Product list by categoryid
router.get('/getProductList/:categoryId', userController.getProductList);

// place an order for product
router.post('/submitOrder', userController.submitOrder);


module.exports = router;
// export default router;