const express = require('express');
const router = express.Router();

const adminController = require("../controller/adminController.js");
const { requireAdmin } = require('../utils/auth.js');

//Admin Signup
router.post('/signup', adminController.signupAdmin);

// Admin Login
router.post('/login', requireAdmin, adminController.loginAdmin);

// Fetch All Users
router.get('/fetchAllUsers', requireAdmin, adminController.fetchAllUsers);

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