const router = require('express').Router();
const routesUsers = require('./users');
const routesRestaurants = require('./restaurants');
const routesOrders = require('./orders');
const routesChats = require('./chats');

router.use('/users', routesUsers);
router.use('/restaurants', routesRestaurants);
router.use('/orders', routesOrders);
router.use('/chats', routesChats);

module.exports = router;