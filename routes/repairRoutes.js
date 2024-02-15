const express = require('express');
const router = express.Router();
const RepairModel = require('../models/repairModel');

// Submit Repair Request
router.post('/submitRepairRequest', async (req, res) => {
  try {
    const {
      userId,
      deviceType,
      issueDescription,
      listOfImages,
      addressOfRepair,
    } = req.body;

    // Validation
    if (!userId || !deviceType || !issueDescription || !listOfImages || !addressOfRepair) {
      return res.status(400).json({
        responseCode: '400',
        responseMessage: 'Bad Request: Missing required fields',
      });
    }

    const newRepair = await RepairModel.create({
      userId,
      deviceType,
      issueDescription,
      listOfImages,
      addressOfRepair,
    });

    res.status(201).json({
      responseCode: '201',
      responseMessage: 'Repair request submitted successfully',
      repairDetails: newRepair,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      responseCode: '500',
      responseMessage: 'Internal Server Error',
      error: error.message,
    });
  }
});

// Get Repair Status
router.get('/getRepairStatus/:userId', async (req, res) => {
  try {
    const userId = req.params.userId;
    const repairStatus = await RepairModel.findOne({ userId });

    if (!repairStatus) {
      res.status(404).json({
        responseCode: 404,
        responseMessage: 'Not Found',
        error: 'Repair status not found for the provided userId.',
      });
      return;
    }

    res.status(200).json({
      responseCode: 200,
      responseMessage: 'Success',
      data: {
        userId: repairStatus.userId,
        status: repairStatus.status,
      },
    });
  } catch (error) {
    res.status(500).json({
      responseCode: 500,
      responseMessage: 'Internal Server Error',
      error: error.message,
    });
  }
});

module.exports = router;