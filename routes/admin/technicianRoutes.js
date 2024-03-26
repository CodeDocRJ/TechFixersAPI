const express = require( 'express' );
const { getTechnicianList } = require( '../../controller/admin/technicianController' );
const technicianRouter = express.Router();

technicianRouter.get( '/getTechnicianList', getTechnicianList );

module.exports = technicianRouter;