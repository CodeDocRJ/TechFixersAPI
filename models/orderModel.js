const mongoose = require( 'mongoose' );

const orderSchema = new mongoose.Schema( {
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    firstName: String,
    lastName: String,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number,
    address: String,
    orderPlaceDateTime: {
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
    }
}, {
    timestamps: true,
} );

const OrderModel = mongoose.model( 'Order', orderSchema );

module.exports = OrderModel;