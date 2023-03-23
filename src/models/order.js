const {Schema, model} = require('mongoose');

const orderSchema = new Schema({
    customerId: {type: String},
    restaurantId: {type: String},
    total: {type: Number},
    status: {type: String},
    products: {type: Array},
    quantity: {type: String}
});

module.exports = model('orders', orderSchema);