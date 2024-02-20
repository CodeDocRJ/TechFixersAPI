const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowerCase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profileImage: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: true,
    },
    dateOfBirth: {
      type: String,
      required: false,
      validate: {
        validator: function (v) {
          // Date of birth format: DD-MM-YYYY
          return /^\d{2}-\d{2}-\d{4}$/.test(v);
        },
        message: props => `${props.value} is not a valid date of birth! (DD-MM-YYYY)`
      }
    },
    address: {
      houseNumber: {
        type: String,
        required: false,
      },
      streetName: {
        type: String,
        required: false,
      },
      city: {
        type: String,
        required: false,
      },
      postCode: {
        type: String,
        required: false,
        // validate: {
        //   validator: function (v) {
        //     // Postal code pattern: A1A 1A1
        //     return /^[A-Za-z]\d[A-Za-z] \d[A-Za-z]\d$/.test(v);
        //   },
        //   message: props => `${props.value} is not a valid postal code!`
        // }
      },
    },
    role: {
      type: String,
      enum: ['Admin', 'User', 'Tech'],
      required: true,
      default: 'User',
    },
    isVerified: {
      required: true,
      type: Boolean,
      default: false, // Default value is false, all the normal signup
    },
    token: String,
  },
  {
    timestamps: true,
  }
);

//this is creation of the collection/model
const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
// export default mongoose.model("User", userSchema);