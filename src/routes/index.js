const router = require('express').Router();
const routesUsers = require('./users');

router.use('/users', routesUsers);

module.exports = router;