const express = require("express");
require('./dbs/conn');

const app = express();
// require("dotenv").config();
const port = process.env.port || 3000;

const userRoutes  = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const repairRoutes = require('./routes/repairRoutes');
const accessoryRoutes = require('./routes/accessoryRoutes');

// Middleware
app.use(express.json());

// Routes
app.use('/user', userRoutes);
app.use('/admin', adminRoutes);
app.use('/repair', repairRoutes);
app.use('/accessory', accessoryRoutes);

app.get("/",async (req, res) => {
    res.send("HELLOW RJ");
});

app.listen(port, (req, res) => {
    console.log(`CONNECTION IS LIVE AT ${port} successfully...`);
});