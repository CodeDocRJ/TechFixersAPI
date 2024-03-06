const express = require('express');
const router = express.Router();

const adminController = require("../controller/adminController.js");
const { requireAdmin } = require('../utils/auth.js');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUDINARY_KEY,
    api_secret: process.env.CLOUDINARY_SECRET
});

// Configure multer storage for Cloudinary
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'CatrgoriesFolder', // Optional - folder name in Cloudinary
        format: async (req, file) => 'jpg', // Optional - file format
        public_id: (req, file) => 'sample-image' // Optional - set your own public ID
    }
});

// Initialize multer instance with Cloudinary storage
const upload = multer({ storage: storage });

//Admin Signup
router.post('/signup', adminController.signupAdmin);

// Admin Login
router.post('/login', adminController.loginAdmin);

// Fetch All Users
router.get('/fetchAllUsers', requireAdmin, adminController.fetchAllUsers);

//create product category
router.post('/createProductCategory', adminController.createProductCategory);

//upload product
router.post('/uploadProduct', upload.single('image'), adminController.uploadProduct);

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