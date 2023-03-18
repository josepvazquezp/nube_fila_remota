const {Schema, model} = require('mongoose');

const chatSchema = new Schema({
    customerId: {type: String},
    restaurantId: {type: String},
    messages: {type: Array}
});

module.exports = model('chats', chatSchema);