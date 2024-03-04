const AdminModel = require('../models/adminModel');
const UserModel = require('../models/userModel');
const RepairModel = require('../models/repairModel');
const AccessoryModel = require('../models/accessoryModel');

require("dotenv").config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.signupAdmin = async (req, res) => {
    try {
        const { userName, email, password, phone, role } = req.body;

        console.log("Request Body 222:", userName);

        const existingUser = await AdminModel.findOne({ email });

        console.log("Request Body 111:", req.body);
        
        if (existingUser) {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'User already exists with this email',
            }).send();
            return;
        }
        // const salt = await bcrypt.genSalt(10);
        // const hashedPassword = await bcrypt.hash(password, salt);
        const salt = await bcrypt.genSalt(10);
        if (!salt) {
            return res.status(500).json({
                responseCode: 500,
                responseMessage: 'Error generating salt'
            });
        }

        const hashedPassword = await bcrypt.hash(password, salt);
        if (!hashedPassword) {
            return res.status(500).json({
                responseCode: 500,
                responseMessage: 'Error hashing password'
            });
        }

        // Create new user
        const newAdmin = new AdminModel({
            userName,
            email,
            password: hashedPassword,
            phone,
            role
        });
        await newAdmin.save();

        res.status(201).json({
            responseCode: 201,
            responseMessage: 'Admin created successfully',
            AdminData: newAdmin
        });

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        }).send();
    }
}

module.exports.loginAdmin = async (req, res) => {
    try {
        const { emailOrUsername, password } = req.body;

        // Check if user exists with email
        let user = await AdminModel.findOne({ email: emailOrUsername });

        // If not found, check if user exists with username
        if (!user) {
            user = await AdminModel.findOne({ userName: emailOrUsername });
        }
        if (!user) {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'Admin not found with this email or username',
            }).send();
            return;
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY);
        res.json({
            responseCode: 200,
            responseMessage: 'Login successful as an Admin',
            AdminData: user,
            token
        });

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        }).send();
    }
}

module.exports.fetchAllUsers = async (req, res) => {
    try {
        const allUsers = await UserModel.find();

        if (allUsers.length > 0) {
            res.status(200).json({
                responseCode: 200,
                responseMessage: 'Users retrieved successfully',
                Users: allUsers,
            });
        } else {
            res.status(404).json({
                responseCode: 404,
                responseMessage: 'No Users found',
                Users: [],
            });
        }
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        }).send();
    }
}