const express = require( 'express' );
const { getNotificationList, getNotification } = require( '../../controller/admin/notificationsController' );
const notificationRouter = express.Router();

notificationRouter.get( '/getNotificationList', getNotificationList );

notificationRouter.get( '/getNotification/:notificationId', getNotification );

module.exports = notificationRouter;