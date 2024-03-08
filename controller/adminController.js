const AdminModel = require('../models/adminModel');
const UserModel = require('../models/userModel');
const RepairModel = require('../models/repairModel');
const OrderModel = require('../models/orderModel');
const ProductCategoryModel = require('../models/productCategoryModel');
const ProductModel = require('../models/productModel'); 

require("dotenv").config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const cloudinary = require('cloudinary').v2;


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
        let admin = await AdminModel.findOne({ email: emailOrUsername });

        // If not found, check if user exists with username
        if (!admin) {
            admin = await AdminModel.findOne({ userName: emailOrUsername });
        }
        if (!admin) {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'Admin not found with this email or username'
            }).send();
            return;
        }

        // Validate password
        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res.status(401).json({ 
                message: 'Invalid credentials' 
            });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: admin._id }, process.env.JWT_SECRET_KEY);
        res.json({
            responseCode: 200,
            responseMessage: 'Login successful as an Admin',
            AdminData: admin,
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
                UserCount: allUsers.length,
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

module.exports.createProductCategory = async (req, res) => {
    try {
        const { catName, catType } = req.body;

        // Check if category name already exists
        const existingCategory = await ProductCategoryModel.findOne({ catName });
        if (existingCategory) {
            return res.status(400).json({
                responseCode: 400,
                responseMessage: 'Category already exists'
            });
        }

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'Appliances' });

        // Create new category object
        const newCategory = new ProductCategoryModel({
            catName,
            catType,
            categoryImage: result.secure_url // Save Cloudinary image URL
        });

        await newCategory.save();

        // Send response
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Category saved successfully',
            Category: newCategory
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports.uploadProduct = async (req, res) => {
    try {
        const { categoryId, name, type, brand, model, price, description, rating } = req.body;

        // Upload image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, { folder: 'Products' });

        const newProduct = new ProductModel({
            categoryId,
            name,
            type,
            brand,
            model,
            price,
            description,
            productImage: result.secure_url, // Save Cloudinary image URL
            rating
        });
        await newProduct.save();
        // res.status(201).json(newProduct);
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Product uploaded successfully',
            Product: newProduct
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        });
    }
};

module.exports.getOrderList = async (req, res) => {
    try {
        const orders = await OrderModel.find();
        // res.json(orders);
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Order List Retrieved successfully',
            OrderList: orders
        });

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        });
    }
};