const express = require( 'express' );
const { getUserList } = require( '../../controller/admin/userController' );
const userRouter = express.Router();

userRouter.get( '/getUserList', getUserList );

module.exports = userRouter;