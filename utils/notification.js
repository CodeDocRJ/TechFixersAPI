const NotificationModel = require( "../models/notifictaionModel" );
const UserModel = require( "../models/userModel" );

exports.sendNotificationToSingle = async ( id, title, message ) =>
{
    try
    {
        let createdvalue = {};

        const user = await UserModel.findById( id );

        if ( user.role === 'Admin' ) { createdvalue.adminId = id; }
        if ( user.role === 'User' ) { createdvalue.userId = id; }
        if ( user.role === 'Tech' ) { createdvalue.techId = id; }

        const sendNotification = new NotificationModel( {
            title: title,
            message: message,
            ...createdvalue
        } );

        await sendNotification.save();

        return sendNotification;
    } catch ( error )
    {
        console.error( "Error in send notification to single : ", error );
    }
};

exports.sendNotificationToMultiples = async ( ids, title, message ) =>
{
    try
    {
        let notifications = [];

        for ( let id of ids )
        {
            let createdValue = {};

            const user = await UserModel.findById( id );

            if ( user.role === 'Admin' ) { createdValue.adminId = id; }
            if ( user.role === 'User' ) { createdValue.userId = id; }
            if ( user.role === 'Tech' ) { createdValue.techId = id; }

            const notification = new NotificationModel( {
                title: title,
                message: message,
                ...createdValue
            } );
            notifications.push( notification );
        }
        const savedNotifications = await NotificationModel.insertMany( notifications );

        return savedNotifications;
    } catch ( error )
    {
        console.error( "Error in send notifictaion to multiple : ", error );
    }
};