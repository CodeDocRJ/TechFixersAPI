const UserModel = require('../models/userModel');


module.exports.checkUsername = async (req, res) => {
    const { username } = req.params;

    try {
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
        // const newUser = await UserModel.create(req.body);
        // res.status(201).json({ 
        //   responseCode: 201, 
        //   responseMessage: 'User Created Successfully', 
        //   user: newUser 
        // }).send();

        console.log("Request Body:", req.body);
        console.log("Uploaded File:", req.file);

        const { userName, email, password, phone, dateOfBirth, address, role, isVerified } = req.body;

        // Profile picture logic
        let profilePic = '';
        if (req.file) {
            profilePic = req.file.path;
            console.log("Profile Picture Path:", profilePic); // Log the profile picture path
        }

        const newUser = await UserModel.create({
            userName,
            email,
            password,
            profilePic,
            phone,
            dateOfBirth,
            address,
            role,
            isVerified
        });

        res.status(201).json({
            responseCode: 201,
            responseMessage: 'User Created Successfully',
            user: newUser
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
        const { email, password } = req.body;

        // Check if the user with the provided email exists
        const user = await UserModel.findOne({ email });

        if (!user) {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'User not found with this email',
            }).send();
            return;
        }

        // Check if the provided password matches the stored password
        if (password === user.password) {
            res.status(200).json({
                responseCode: 200,
                responseMessage: 'Login successful',
                user
            }).send();
        } else {
            res.status(401).json({
                responseCode: 401,
                responseMessage: 'Invalid Password!',
            }).send();
        }
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

module.exports.getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find();
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Users Retrieved Successfully',
            users
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error
        });
    }
}

module.exports.createAccessory = async (req, res) => {
    try {
        const newAccessory = await AccessoryModel.create(req.body);
        res.status(201).json({
            responseCode: 201,
            responseMessage: 'Accessory created successfully',
            newAccessory
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error
        });
    }
    try {
        const { userId, accessoryName, description } = req.body;

        // Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            res.status(400).json({
                responseCode: 400,
                responseMessage: 'User not found',
                error: null
            });
            return;
        }

        // Create the accessory linked to the user
        const newAccessory = await AccessoryModel.create({ userId, accessoryName, description });
        res.status(201).json({
            responseCode: 201, responseMessage: 'Accessory created successfully',
            data: newAccessory
        });
    } catch (error) {

        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error
        });
    }
}

module.exports.deleteAccessory = async (req, res) => {
    try {
        const { userId, accessoryId } = req.params;

        // Check if the user exists
        const user = await UserModel.findById(userId);
        if (!user) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: 'User not found'
            });
        }

        // Check if the accessory exists
        const accessory = await AccessoryModel.findById(accessoryId);
        if (!accessory) {
            return res.status(404).json({
                responseCode: 404,
                responseMessage: 'Accessory not found'
            });
        }

        // Check if the accessory belongs to the user
        if (accessory.userId !== userId) {
            return res.status(403).json({
                responseCode: 403,
                responseMessage: 'Forbidden: Accessory does not belong to the user'
            });
        }

        // Delete the accessory
        await AccessoryModel.findByIdAndDelete(accessoryId);

        // Provide success response with user details
        res.status(200).json({
            responseCode: 200,
            responseMessage: 'Accessory deleted successfully',
            user: {
                userId: user._id,
                userName: user.userName,
                email: user.email,
                // Add other user details as needed
            },
            deletedAccessory: {
                accessoryId: accessory._id,
                accessoryName: accessory.accessoryName,
                // Add other accessory details as needed
            },
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error
        });
    }
}

module.exports.userSellingHistory = async (req, res) => {
    try {
        const userId = req.params.userId;
        const user = await UserModel.findById(userId);

        if (!user) {
            res.status(404).json({
                responseCode: 404,
                responseMessage: 'User not found'
            });
            return;
        }

        // Assuming userSellingHistory is an array field in the user model
        const sellingHistory = user.userSellingHistory || [];

        res.status(200).json({
            responseCode: 200,
            responseMessage: 'User Selling History retrieved successfully',
            data: sellingHistory
        });
    } catch (error) {
        res.status(500).json({
            responseCode: 500,
            responseMessage: 'Internal Server Error',
            error: error.message
        });
    }
}