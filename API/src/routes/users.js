const express = require('express');
const router = express.Router();
const controller = require('./../controllers/users');
const path = require('path');
const multerS3 = require('multer-s3');
const { S3Client } = require("@aws-sdk/client-s3");

const multer = require('multer');

// const multerStorage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, path.join(__dirname, '..', '..', 'uploads'));
//     },
//     filename: (req, file, cb) => {
//         const nombre = req.params.id;
//         const extention = file.originalname.split('.').pop();
//         cb(null, `${nombre}.${extention}`);
//     }
// });

const s3 = new S3Client({                   // como crear cuenta
    region: "us-east-1",
    credentials: {
        accessKeyId: "ASIARAKHDECVC26QYXXZ",
        secretAccessKey: "ehlpS05zTbHAAGoqfLPE3J4JknOEZNZtckxLENXz",
        sessionToken: "FwoGZXIvYXdzEO3//////////wEaDN5tHhHhb6dQNzVs+yLGARXitY6NORE/K0O7QE6HF1DJgERktTNIOlCz918+9GEymGZmLWYiEayiMOliKbpVwlPqxfPioBkjKkvTY149NIYovB5lI5r1+SHShcmVtZwl5c4UU9U0EPlkmHy1uwelssTR4uMlYSXJqCG1kwEUtcc3IuZ2dHawtlD1epR9d2PnINSo2qXA4sApii1t25+pqBGNdEhUb9Z6Zrdmf+DmqhSN3IUiOfzf/kERBkbPaQnYDnjvPArxr6OPkkq6YXG1jJg75GAaICiJ2dCpBjItugSWd98x1tSyZb1EB3TImOi4HCWhehmutajj7eONiqsFpV7SwtCSx46LJPe/"
    }
});

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
        cb(null, `${name}.${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const flag = file.mimetype.startsWith('image');
    cb(null, flag);
};

const upload = multer({ storage: s3Storage, fileFilter: fileFilter });

router.post('/upload/:id', upload.single('file'), (req, res) => {
    res.status(201).send({ image: req.file.filename });
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

router.post('/login/google', express.json(), controller.googleLogin);

module.exports = router;