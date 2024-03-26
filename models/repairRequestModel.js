const mongoose = require( '../dbs/conn' );

const repairRequestSchema = new mongoose.Schema( {
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  repairCategoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'RepairCategory'
  },
  techId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  issueDescription: {
    type: String,
    required: true,
  },
  applianceImage: {
    type: String,
    required: false,
  },
  requestMode: {
    type: String,
    enum: [ 'Remote', 'In Person', 'At Home' ],
    default: 'Remote',
  },
  status: {
    type: String,
    enum: [ 'Submitted', 'Pending', 'In Progress', 'Completed' ],
    default: 'Submitted',
  },
  requestStatus: {
    type: String,
    enum: [ 'Assigned', 'Cancelled', 'Completed' ],
    default: null
  },
  addressOfRepair: {
    houseNumber: String,
    streetName: String,
    city: String,
    postCode: String,
  },
  date: {
    type: String,
    required: false,
    validate: {
      validator: function ( v )
      {
        // Date of birth format: DD-MM-YYYY
        return /^\d{2}-\d{2}-\d{4}$/.test( v );
      },
      message: props => `${ props.value } is not a valid date of birth! (DD-MM-YYYY)`
    }
  },
  time: {
    type: String,
    required: false,
    validate: {
      validator: function ( v )
      {
        // Regular expression for time validation
        return /^(1[0-2]|0?[1-9]):([0-5][0-9]) (AM|PM)$/i.test( v );
      },
      message: props => `${ props.value } is not a valid time format (HH:MM AM/PM)`
    }
  },
}, {
  timestamps: true
} );

const RepairRequestModel = mongoose.model( 'RepairRequest', repairRequestSchema );

module.exports = RepairRequestModel;
