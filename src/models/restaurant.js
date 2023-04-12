const {Schema, model} = require('mongoose');

const restaurantSchema = new Schema({
    name: {type: String},
    email: {type: String},
    products: {type: Array},
    description: {type: String},
    type: {type: String},
    location: {type: String},
    image: {type: String}
});

module.exports = model('restaurants', restaurantSchema);