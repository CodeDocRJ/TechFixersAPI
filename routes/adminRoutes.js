const express = require('express');
const router = express.Router();

const adminController = require("../controller/adminController.js");
const authMiddleware = require('../utils/auth.js');

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Configure multer storage for Cloudinary
// const storage = new CloudinaryStorage({
//     cloudinary: cloudinary,
//     params: {
//         folder: 'CatrgoriesFolder', // Optional - folder name in Cloudinary
//         format: async (req, file) => 'jpg', // Optional - file format
//         public_id: (req, file) => 'sample-image' // Optional - set your own public ID
//     }
// });

// // Initialize multer instance with Cloudinary storage
// const upload = multer({ storage: storage });

// Multer Configuration for file uploads
const storage = multer.diskStorage({});

const uploadcategoryImage = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG and JPEG images are allowed'));
        }
    }
}).single('categoryImage');

const uploadproductImage = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 5 // 5MB file size limit
    },
    fileFilter: (req, file, cb) => {
        if (file.mimetype === 'image/png' || file.mimetype === 'image/jpeg') {
            cb(null, true);
        } else {
            cb(new Error('Only PNG and JPEG images are allowed'));
        }
    }
}).single('productImage');

//Admin Signup
router.post('/signup', adminController.signupAdmin);

// Admin Login
router.post('/login', adminController.loginAdmin);

// Fetch All Users
router.get('/fetchAllUsers', authMiddleware.requireAdmin, adminController.fetchAllUsers);

//create product category
router.post('/createProductCategory', authMiddleware.requireAdmin, uploadcategoryImage, adminController.createProductCategory);

//upload product
router.post('/uploadProduct', authMiddleware.requireAdmin, uploadproductImage, adminController.uploadProduct);

//get order list placed by users
router.get('/getOrderList', adminController.getOrderList);

// Fetch All Repairs
// router.get('/fetchAllTheRepair', async (req, res) => {
//   try {
//     const allRepairs = await RepairModel.find();
//     res.status(200).json({
//       responseCode: 200,
//       responseMessage: 'Repairs retrieved successfully',
//       data: allRepairs,
//     });
//   } catch (error) {
//     console.error('Error fetching repairs:', error);
//     res.status(500).json({
//       responseCode: 500,
//       responseMessage: 'Internal Server Error',
//       error: error.message,
//     });
//   }
// });

// // Fetch All Accessory Listings
// router.get('/fetchAllTheAccessoryListings', async (req, res) => {
//   try {
//     const allAccessories = await AccessoryModel.find();
//     res.status(200).json({
//       responseCode: 200,
//       responseMessage: 'Accessory listings retrieved successfully',
//       data: allAccessories,
//     });
//   } catch (error) {
//     console.error('Error fetching accessory listings:', error);
//     res.status(500).json({
//       responseCode: 500,
//       responseMessage: 'Internal Server Error',
//       error: error.message,
//     });
//   }
// });

module.exports = router;