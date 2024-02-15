const mongoose = require('../dbs/conn');

const adminSchema = new mongoose.Schema({
  username: String,
  password: String,
});

const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;