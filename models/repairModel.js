const mongoose = require('../dbs/conn');

const repairRequestSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  deviceType: {
    type: String,
    required: true,
  },
  issueDescription: {
    type: String,
    required: true,
  },
  listOfImages: [String],
  status: {
    type: String,
    enum: ['Submitted', 'Pending', 'In Progress', 'Completed'],
    default: 'Pending',
  },
  addressOfRepair: {
    houseNumber: String,
    streetName: String,
    city: String,
    postcode: String,
  },
  timeStamp: { type: Date, default: Date.now },
});

const RepairModel = mongoose.model('RepairRequest', repairRequestSchema);

module.exports = RepairModel;