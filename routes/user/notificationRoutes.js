const express = require( 'express' );
const { getNotification, getNotificationList } = require( '../../controller/user/notificationsController' );
const notificationRouter = express.Router();

notificationRouter.get( '/getNotificationList', getNotificationList );

notificationRouter.get( '/getNotification/:notificationId', getNotification );

module.exports = notificationRouter;