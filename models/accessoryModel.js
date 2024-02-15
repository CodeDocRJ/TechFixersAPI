const mongoose = require('../dbs/conn');

const accessorySchema = new mongoose.Schema({
  userId: String,
  accessoryName: String,
  description: String,
});

const AccessoryModel = mongoose.model('Accessory', accessorySchema);

module.exports = AccessoryModel;