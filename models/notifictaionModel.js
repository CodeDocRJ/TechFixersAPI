const mongoose = require( 'mongoose' );

const notificationSchema = new mongoose.Schema(
    {
        adminId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        techId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        title: {
            type: String,
            required: false,
        },
        message: {
            type: String,
            required: false,
        },
        is_read: {
            type: Boolean,
            default: false,
        },

    },
    {
        timestamps: true,
    }
);
const NotificationModel = mongoose.model( 'Notification', notificationSchema );

module.exports = NotificationModel;