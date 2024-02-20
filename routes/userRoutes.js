const express = require('express');
const router = express.Router();

const userController = require("../controller/userController.js");
const authMiddleware = require('../utils/auth.js');


// const nodemailer = require('nodemailer');
const multer = require('multer');
const path = require('path');

// const UserModel = require('../models/userModel');
// const AccessoryModel = require('../models/accessoryModel');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

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

// User Profile
router.get('/logOut/', authMiddleware, userController.userLogOut);

// User Update
router.put('userUpdate/:userId', userController.updateUser);

router.get('/allUsers', userController.getAllUsers);

// Create Accessory
router.post('/createAccessory', userController.createAccessory);

// Delete Accessory
router.delete('deleteAccessory/:id', userController.deleteAccessory);

// User Selling History
router.get('/userSellingHistory/:userId', userController.userSellingHistory);


module.exports = router;
// export default router;