const UserModel = require('../models/userModel');
const ProductCategory = require('../models/productCategoryModel');
const Product = require('../models/productModel');
const Order = require('../models/orderModel');

require("dotenv").config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


module.exports.checkUsername = async (req, res) => {
    try {
        const { username } = req.params;

        const existingUser = await UserModel.findOne({ userName: username });
        if (existingUser) {
            // User with the given username already exists
            res.status(200).json({
                responseCode: 200,
                responseMessage: "Username already registered",
                exists: true
            }).send();

        } else {
            // Username is available
            res.status(200).json({
                responseCode: 200,
                responseMessage: "Username available",
                exists: false
            }).send();
        }
    } catch (error) {
        // Error occurred while querying the database
        console.error("Error checking username:", error);
        // For other errors
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        }).send();
    }
}

module.exports.signupUser = async (req, res) => {
    try {
        console.log("Request Body:", req.body);

        const { userName, email, password, phone, role } = req.body;
        console.log("Password 1:", email);
        // Profile picture logic
        // let profilePic = '';
        // if (req.file) {
        //     profilePic = req.file.path;
        //     console.log("Profile Picture Path:", profilePic); // Log the profile picture path
        // }
        // Check if user already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'User already exists with this email',
            }).send();
            return;
        }

        console.log("Password 2:", password);
        // Hash the password
        // const hashedPassword = await bcrypt.hash(password, 10);
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        const newUser = new UserModel({
            userName,
            email,
            password: hashedPassword,
            phone,
            role
        });
        await newUser.save();

        res.status(201).json({
            responseCode: 201,
            responseMessage: 'User created successfully',
            UserData: newUser
        });
    } catch (error) {
        if (error.code === 11000 && error.keyPattern.userName) {
            // If duplicate username
            res.status(400).json({
                responseCode: 400,
                responseMessage: 'Username already exists',
                error: error.message
            }).send();
        } else if (error.code === 11000 && error.keyPattern.email) {
            // If duplicate email
            res.status(400).json({
                responseCode: 400,
                responseMessage: 'Email already registered',
                error: error.message
            }).send();
        } else if (error.code === 11000 && error.keyPattern.phone) {
            // If duplicate email
            res.status(400).json({
                responseCode: 400,
                responseMessage: 'Phone already registered',
                error: error.message
            }).send();
        } else {
            // For other errors
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Internal Server Error',
                error: error.message
            }).send();
        }
    }
}


module.exports.loginUser = async (req, res) => {
    try {
        // // Check if user exists by email or username
        // const user = await User.findOne({ $or: [{ email }, { username }] });
        const { emailOrUsername, password } = req.body;

        // Check if user exists with email
        let user = await UserModel.findOne({ email: emailOrUsername });

        // If not found, check if user exists with username
        if (!user) {
            user = await UserModel.findOne({ userName: emailOrUsername });
        }
        if (!user) {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'User not found with this email or username',
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
            responseMessage: 'Login successful',
            UserData: user,
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


module.exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user with the provided email exists
        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'User not found with this email',
            }).send();
            return;
        }

        // Generate a random password reset token (you may use a library for this)
        const resetToken = Math.random().toString(36).substring(7);

        // Set token expiration to 10 minutes from now
        const resetTokenExpiration = new Date();
        resetTokenExpiration.setMinutes(resetTokenExpiration.getMinutes() + 10);

        // Update user's password reset token and expiration in the database
        user.resetToken = resetToken;
        user.resetTokenExpiration = resetTokenExpiration;
        await user.save();

        // // Create Nodemailer transporter
        // const transporter = nodemailer.createTransport({
        //   service: 'Gmail', // Specify email service provider
        //   auth: {
        //     user: 'techfixersolution@gmail.com', // email address
        //     pass: 'Tech@102@Fixers', // email password
        //   },
        //   debug: true // Enable debugging
        // });

        // Create Nodemailer transporter for SMTP
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: 'techfixermail@gmail.com', // email address
                pass: 'dozs jmhd usur pwxy', // email password
            },
        });

        const mailOptions = {
            from: 'your-email@gmail.com',
            to: email,
            subject: 'Password Reset',
            html: `<p>You are receiving this email because you (or someone else) have requested the reset of the password for your account.</p>
             <p>Please click on the following link, or paste this into your browser to complete the process:</p>
             <p><a href="http://localhost:3000/resetpassword/${resetToken}">Reset Password</a></p>
             <p>If you did not request this, please ignore this email and your password will remain unchanged.</p>`
        };


        // await transporter.sendMail(mailOptions);
        // res.status(200).json({
        //   responseCode: 200,
        //   responseMessage: 'Password reset email sent successfully',
        // });

        // Send email
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log(error);
                res.status(500).json({
                    responseCode: 500,
                    responseMessage: 'Failed to send password reset email',
                    error: error.message,
                }).send();
            } else {
                console.log('Email sent: ' + info.response);
                res.status(200).json({
                    responseCode: 200,
                    responseMessage: 'Password reset email sent successfully',
                }).send();
            }
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message,
        });
    }
}

module.exports.getProfile = async (req, res) => {
    try {
        // Extract user ID from the authenticated request
        const userId = req.user.userId;

        // Fetch user profile data from the database
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(404).json({
                responseCode: 404,
                responseMessage: 'User not found',
            }).send();
            return;
        }

        const token = await req.header('Authorization').replace('Bearer ', ''); // Extract token from request header
        // Send the user profile data in the response
        res.json({
            responseCode: 200,
            responseMessage: 'Profile data retrieved successfully',
            user,
            token
        })
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message,
        });
    }
}

module.exports.updateProfile = async (req, res) => {
    try {
        const { userName, email, password, phone, dateOfBirth, address, role, isVerified, token } = req.body;
        const { userId } = req.params; // Extract userId from request parameters
        const profileImage = req.file ? req.file.path : null;

        // Find the user by userId
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: 'User not found',
            }).send();
        }
        
        user.dateOfBirth = dateOfBirth;
        user.address = address;
        user.role = role;
        user.isVerified = isVerified;
        user.profileImage = profileImage || user.profileImage;
        console.log("GET PROFILE 1:", user.profileImage);

        await user.save();
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Profile updated successfully',
            user,
            token: token
        }).send();

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message,
        });
    }
}


module.exports.userLogOut = async (req, res) => {
    try {
        res.json({
            responseCode: 200,
            responseMessage: 'Logout successfully',
        }).send();

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message,
        });
    }
};


module.exports.updateUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const updatedUser = await UserModel.findByIdAndUpdate(userId, req.body, { new: true });
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'User Updated Successfully',
            user: updatedUser
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        });
    }
}


module.exports.getProductCategory = async (req, res) => {
    try {
        try {
            const categories = await ProductCategory.find({}, '_id catName catType categoryImage');
            res.status(200).json({
                responseCode: 200,
                responseMessage: 'Categories Retrieved Successfully',
                ProductCategories: categories
            });
        } catch (error) {
            res.status(500).json({
                responseCode: 500,
                responseMessage: 'Internal Server Error',
                error: error.message
            });
        }
    } catch (error) {

    }
}

module.exports.getProductList = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await ProductCategory.findById(categoryId);
        if (!category) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: 'Category not found',
            }).send();
        }
        const products = await Product.find({ categoryId }, '-categoryId').lean();
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Product List Retrieved Successfully',
            ProductCount: products.length,
            Products : products
        });

    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        });
    }
}

//submit order according to product class with the user details
module.exports.submitOrder = async (req, res) => {
    try {
        // const { userId, productId, quantity } = req.body;
        // const user = await UserModel.findById(userId);
        // if (!user) {
        //     return res.status(404).json({
        //         responseCode: 404,
        //         responseMessage: 'User not found',
        //     }).send();
        // }
        // const product = await Product.findById(productId);
        // if (!product) {
        //     return res.status(404).json({
        //         responseCode: 404,
        //         responseMessage: 'Product not found',
        //     }).send();
        // }
        // const order = new Order({
        //     userId,
        //     productId,
        //     quantity
        // });
        // await order.save();
        // res.status(200).json({
        //     responseCode: 200,
        //     responseMessage: 'Order Submitted Successfully',
        //     order
        // });
        const { userId, firstName, lastName, productId, quantity, address, orderPlaceDateTime } = req.body;
        const newOrder = new Order({
            userId,
            firstName,
            lastName,
            productId,
            quantity,
            address,
            orderPlaceDateTime
        });
        await newOrder.save();
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Order Submitted Successfully',
            order: newOrder
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        });
    }
}