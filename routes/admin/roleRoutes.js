const express = require( 'express' );
const { changeRole } = require( '../../controller/admin/roleController' );
const roleRouter = express.Router();

roleRouter.put( '/changeRole/:id', changeRole );

module.exports = roleRouter;