const mongoose = require( 'mongoose' );

const cardSchema = new mongoose.Schema( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    cardNumber: {
        type: String,
        required: true
    },
    expiryDate: {
        type: String,
        required: true,
        validate: {
            validator: function ( v )
            {
                // Date format: MM/YYYY
                return /^\d{2}\/\d{4}$/.test( v );
            },
            message: props => `${ props.value } is not a valid date! (MM/YYYY)`
        }
    },
    CVV: {
        type: String,
        required: true
    },
    country: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
        required: true
    },
    cardHolderName: {
        type: String,
        required: true
    },
    isDefault: {
        type: Boolean,
        default: true
    }
}, {
    timestamps: true,
} );

const CardModel = mongoose.model( 'Card', cardSchema );

module.exports = CardModel;