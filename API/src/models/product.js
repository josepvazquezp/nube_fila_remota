const {Schema, model} = require('mongoose');

const productSchema = new Schema({
    Name: {type: String},
    Description: {type: String},
    Price: {type: Number},
    Available: {type: Boolean},
    Image: {type: String}
});

module.exports = model('products', productSchema);