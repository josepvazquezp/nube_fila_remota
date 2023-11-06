const express = require('express');
const router = express.Router();
const controller = require('./../controllers/users');
const path = require('path');
const multerS3 = require('multer-s3');
const s3 = require("./con_s3");

const multer = require('multer');

const s3Storage = multerS3({                // esto dónde se usa tenemos sospecha que es con el handle file en el post
    s3: s3,
    bucket: "filaremotabucket",
    metadata: (req, file, cb) => {
        cb(null, { ...file });
    },
    acl: 'public-read',
    key: (req, file, cb) => {
        const name = req.params.id;
        const ext = file.originalname.split('.').pop();
        cb(null, `user-${name}.${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const flag = file.mimetype.startsWith('image');
    cb(null, flag);
};

const upload = multer({ storage: s3Storage, fileFilter: fileFilter });

router.post('/upload/:id', upload.single('file'), (req, res) => {
    var name = req.params.id;
    var ext = req.file.originalname.split('.').pop();
    res.status(201).send({ image: `user-${name}.${ext}` });
});

/**
 * @swagger
 * /users:
 *  post:
 *    desription: create user
 *    parameters:
 *      - in: body
 *        name: create
 *        description: JSON => email, password, name and type
 *        required: true
 *        schema: 
 *          type: string
 *    responses:
 *      201:
 *        description: post create user
 *      400:
 *        description: bad request
 */
router.post('/', express.json(), controller.create);

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    desription: update user
 *    parameters:
 *      - in: path
 *        name: id
 *        description: user id 
 *        required: true
 *        schema:
 *          type: string
 *      - in: body
 *        name: update
 *        description: JSON => password, name, history, status and image
 *        required: true
 *        schema: 
 *          type: string
 *    responses:
 *      200:
 *        description: put update user
 *      400:
 *        description: bad request
 */
router.put('/:id', express.json(), controller.update);

/**
 * @swagger
 * /users:
 *  get:
 *    desription: list users
 *    responses:
 *      200:
 *        description: get users
 *      400:
 *        description: bad request
 */
router.get('/', controller.list);

/**
 * @swagger
 * /users/{id}:
 *  get:
 *    description: search user
 *    parameters:
 *      - in: path
 *        name: id
 *        description: user id 
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: get user
 *      400:
 *        description: bad request
 */
router.get('/:id', controller.search);

/**
 * @swagger
 * /users/{id}:
 *  delete:
 *    desription: delete user
 *    parameters:
 *      - in: path
 *        name: id
 *        description: user id
 *        required: true
 *        schema:
 *          type: string
 *    responses:
 *      200:
 *        description: delete user
 *      400:
 *        description: bad request
 */
router.delete('/:id', controller.delete);

router.get('/look/:email', controller.searchCreate);

router.post('/login', express.json(), controller.searchLogin);

router.get('/load/:token', controller.loadUser);

module.exports = router;