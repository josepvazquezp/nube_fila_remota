const router = require('express').Router();
const routesUsers = require('./users');
const routesProducts = require('./products');
const routesCards = require('./mastercards');
const routesRatings = require('./ratings');

router.use('/users', routesUsers);
router.use('/products', routesProducts);
router.use('/cards', routesCards);
router.use('/ratings', routesRatings);

module.exports = router;