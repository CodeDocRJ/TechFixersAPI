const { getResult, getErrorResult } = require( "../../base/baseController" );
const NotificationModel = require( "../../models/notifictaionModel" );
const { HttpStatusCode } = require( "../../utils/code" );
const { ERROR, NOTIFICATION } = require( "../../utils/message" );

module.exports.getNotificationList = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;

        const notifications = await NotificationModel.find( { userId: userId } ).sort( { createdAt: -1 } );

        if ( notifications.length === 0 )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, NOTIFICATION.notFound );
        }

        return getResult( res, HttpStatusCode.Ok, notifications, NOTIFICATION.list );
    } catch ( error )
    {
        console.error( "Error in get notification list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};

module.exports.getNotification = async ( req, res ) =>
{
    try
    {
        const userId = req.user.id;
        const notificationId = req.params.notificationId;

        const notification = await NotificationModel.findOne( { _id: notificationId, userId: userId } );

        if ( !notification )
        {
            return getErrorResult( res, HttpStatusCode.NotFound, NOTIFICATION.notFound );
        }

        notification.is_read = true;
        await notification.save();

        return getResult( res, HttpStatusCode.Ok, notification, NOTIFICATION.get );
    } catch ( error )
    {
        console.error( "Error in get notification list : ", error );
        return getResult( res, HttpStatusCode.InternalServerError, error.message, ERROR.internalServerError );
    }
};