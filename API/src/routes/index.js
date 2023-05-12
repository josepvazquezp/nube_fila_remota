const router = require('express').Router();
const routesUsers = require('./users');
const routesProducts = require('./products');
const routesCards = require('./mastercards');
const routesRatings = require('./ratings');
const routesRestaurants = require('./restaurants');
const routesOrders = require('./orders');
const routesChats = require('./chats');
const path = require('path');

router.use('/users', routesUsers);
router.use('/restaurants', routesRestaurants);
router.use('/orders', routesOrders);
router.use('/chats', routesChats);
router.use('/users', routesUsers);
router.use('/products', routesProducts);
router.use('/cards', routesCards);
router.use('/ratings', routesRatings);

router.get('/image/:filename', (req, res) => {
    res.sendFile(path.join(__dirname, '..', '..', 'uploads', req.params.filename));
});

module.exports = router;