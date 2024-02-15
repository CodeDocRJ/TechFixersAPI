const express = require('express');
const router = express.Router();
const AdminModel = require('../models/adminModel');
const UserModel = require('../models/userModel');
const RepairModel = require('../models/repairModel');
const AccessoryModel = require('../models/accessoryModel');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check if username and password are provided
    if (!username || !password) {
      return res.status(400).json({
        responseCode: '400',
        responseMessage: 'Bad Request',
        error: 'Username and password are required',
      });
    }

    // Find admin by username
    const admin = await AdminModel.findOne({ username });

    // Check if admin exists
    if (!admin) {
      return res.status(401).json({
        responseCode: '401',
        responseMessage: 'Unauthorized',
        error: 'Invalid username or password',
      });
    }

    // Check if password is correct
    if (admin.password !== password) {
      return res.status(401).json({
        responseCode: '401',
        responseMessage: 'Unauthorized',
        error: 'Invalid username or password',
      });
    }

    // Successful login
    res.status(200).json({
      responseCode: '200',
      responseMessage: 'Success',
      data: {
        adminId: admin._id,
        username: admin.username,
      },
    });

  } catch (error) {
    console.error('Error in Admin Login:', error);
    res.status(500).json({
      responseCode: '500',
      responseMessage: 'Internal Server Error',
      error: 'Something went wrong',
    });
  }
});

// Fetch All Users
router.get('/fetchAllUsers', async (req, res) => {
  try {
    const allUsers = await UserModel.find();

    if (allUsers.length > 0) {
      res.status(200).json({
        responseCode: 200,
        responseMessage: 'Users retrieved successfully',
        data: allUsers,
      });
    } else {
      res.status(404).json({
        responseCode: 404,
        responseMessage: 'No users found',
        data: [],
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      responseCode: 500,
      responseMessage: 'Internal Server Error',
      error: error.message,
    });
  }
});

// Fetch All Repairs
router.get('/fetchAllTheRepair', async (req, res) => {
  try {
    const allRepairs = await RepairModel.find();
    res.status(200).json({
      responseCode: 200,
      responseMessage: 'Repairs retrieved successfully',
      data: allRepairs,
    });
  } catch (error) {
    console.error('Error fetching repairs:', error);
    res.status(500).json({
      responseCode: 500,
      responseMessage: 'Internal Server Error',
      error: error.message,
    });
  }
});

// Fetch All Accessory Listings
router.get('/fetchAllTheAccessoryListings', async (req, res) => {
  try {
    const allAccessories = await AccessoryModel.find();
    res.status(200).json({
      responseCode: 200,
      responseMessage: 'Accessory listings retrieved successfully',
      data: allAccessories,
    });
  } catch (error) {
    console.error('Error fetching accessory listings:', error);
    res.status(500).json({
      responseCode: 500,
      responseMessage: 'Internal Server Error',
      error: error.message,
    });
  }
});

module.exports = router;