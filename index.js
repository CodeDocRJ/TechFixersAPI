const express = require( "express" );
require( './dbs/conn' );
const bodyParser = require( 'body-parser' );

const app = express();
const port = process.env.PORT || 3001;

const authRoutes = require( './routes/authRoutes' );
const adminAuthRouter = require( "./routes/admin/authRoutes" );
const userAuthRouter = require( "./routes/user/authRoutes" );
const techAuthRouter = require( "./routes/technician/authRoutes" );

// Middleware
app.use( express.json() );

// Parse JSON bodies for JSON requests
app.use( bodyParser.json() );

// Parse URL-encoded bodies for form submissions
app.use( bodyParser.urlencoded( { extended: true } ) );

// Routes
app.use( '/', authRoutes );
app.use( '/admin', adminAuthRouter );
app.use( '/user', userAuthRouter );
app.use( '/tech', techAuthRouter );

// app.get( "/", async ( req, res ) =>
// {
//     res.send( "HELLOW RJ" );
// } );

app.listen( port, ( req, res ) =>
{
    console.log( `CONNECTION IS LIVE AT ${ port } successfully...` );
} );