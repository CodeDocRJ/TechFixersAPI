const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: String,
    firstName: String,
    lastName: String,
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product'
    },
    quantity: Number,
    address: String,
    orderPlaceDateTime: Date
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;