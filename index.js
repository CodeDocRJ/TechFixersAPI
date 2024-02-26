const express = require("express");
require('./dbs/conn');
const bodyParser = require('body-parser');

const app = express();
const port = process.env.PORT || 3000;

const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const repairRoutes = require('./routes/repairRoutes');
const accessoryRoutes = require('./routes/accessoryRoutes');

// Middleware
app.use(express.json());

// Parse JSON bodies for JSON requests
app.use(bodyParser.json());

// Parse URL-encoded bodies for form submissions
app.use(bodyParser.urlencoded({ extended: true }));


// Routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/repair', repairRoutes);
app.use('/accessory', accessoryRoutes);

app.get("/", async (req, res) => {
    res.send("HELLOW RJ");
});

app.listen(port, (req, res) => {
    console.log(`CONNECTION IS LIVE AT ${port} successfully...`);
});