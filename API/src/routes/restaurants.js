const express = require('express');
const router = express.Router();
const controller = require('./../controllers/restaurants');

/**
 * @swagger
 * /restaurants:
 *  post:
 *    desription: create restaurant
 *    parameters:
 *      - in: body
 *        name: create
 *        description: JSON => name, description, type and location
 *        required: true
 *        schema: 
 *          type: string
 *    responses:
 *      201:
 *        description: post create restaurant
 *      400:
 *        description: bad request
 */
router.post('/', express.json(), controller.create);

/**
 * @swagger
 * /restaurants/{id}:
 *  put:
 *    desription: update restaurant
 *    parameters:
 *      - in: path
 *        name: id
 *        description: restaurant id 
 *        required: true
 *        schema:
 *          type: string
 *      - in: body
 *        name: update
 *        description: JSON => update any value
 *        required: true
 *        schema: 
 *          type: string
 *    responses:
 *      200:
 *        description: put update restaurant
 *      400:
 *        description: bad request
 */
router.put('/:id', express.json(), controller.update);

/**
 * @swagger
 * /restaurants:
 *  get:
 *    desription: list restaurants
 *    responses:
 *      200:
 *        description: get restaurants
 *      400:
 *        description: bad request
 */
router.get('/', controller.list);

/**
 * @swagger
 * /restaurants/{id}:
 *  get:
 *    description: search restaurant
 *    parameters:
 *      - in: path
 *        name: id
 *        description: restaurant id 
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: get restaurant
 *      400:
 *        description: bad request
 */
router.get('/:id', controller.search);

/**
 * @swagger
 * /restaurants/{id}:
 *  delete:
 *    desription: delete restaurant
 *    parameters:
 *      - in: path
 *        name: id
 *        description: restaurant id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: delete restaurant
 *      400:
 *        description: bad request
 */
router.delete('/:id', controller.delete);

module.exports = router;