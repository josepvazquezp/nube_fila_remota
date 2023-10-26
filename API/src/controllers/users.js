const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const User = require('./../models/user');

const { PutItemCommand, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_ID);

const key = process.env.KEY;

const UsersController = {
    create: async function createUser(req, res) {
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            type: req.body.type,
            history: [],
            status: "ok",
            image: "../../../assets/images/logo.png"
        };

        let insertValue = new PutItemCommand({
            TableName: 'Users',
            Item: {
                id: {
                    N: "0"
                },
                email: { S: req.body.email },
                password: { S: req.body.password },
                name: { S: req.body.name },
                type: { S: req.body.type },
                history: { L: [] },
                status: { S: "ok" },
                image: { S: "../../../assets/images/logo.png" }
            }
        });

        await conDBC.send(insertValue).then(user => {
            res.status(201).send(newUser);
        })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se pudo crear el usuario');
            });
    },

    update: (req, res) => {
        const id = req.params.id;

        if (req.body.email == undefined && req.body.type == undefined &&
            (req.body.password != undefined || req.body.name != undefined ||
                req.body.history != undefined || req.body.status != undefined ||
                req.body.image != undefined || req.body.restaurant != undefined)) {

            User.findByIdAndUpdate(id, req.body, { new: true })
                .then(user => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send(user);
                })
                .catch(error => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('No se pudo actualizar el usuario');
                });
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send('No se pudo actualizar el usuario');
        }
    },

    list: (req, res) => {
        User.find({})
            .then(users => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(users);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('Algo salio mal');
            });
    },

    search: (req, res) => {
        const id = req.params.id;
        User.findById(id).populate('history')
            .then(user => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(user);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el usuario: ' + id);
            });
    },

    delete: (req, res) => {
        const id = req.params.id;
        User.findByIdAndDelete(id)
            .then(user => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(user);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el usuario: ' + id);
            });
    },

    searchCreate: (req, res) => { //Esta ruta se encarga de verificar si ya existe el email con el que se creara un nuevo usuario
        const Qemail = req.params.email;

        User.find({ email: Qemail })
            .then(user => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(user);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el usuario: ' + id);
            });
    },

    searchLogin: async function getUsuarF(req, res) { //Esta ruta se encarga de verificar si el email y contraseña son correctos
        let getUser = new GetItemCommand({
            TableName: "Users",
            Key: {
                email: {
                    "S": req.body.email
                }
            },
            ExpressionAttributeValues: {
                password: {
                    "S": req.body.password
                }
            }
        });

        let user = await conDBC.send(getUser);

        console.log(user.Item.email);
        // .then(user => {
        //     // Si encontro al usuario, generamos el token
        //     const token = jwt.sign({
        //         id: user._id,
        //         name: user.name,
        //         email: user.email,
        //         type: user.type
        //     }, key);

        //     console.log(user);

        //     res.status(200).send({ user, token });
        // })
        //     .catch(error => {

        //         res.status(400).send('No se encontro el usuario');
        //     });
    },

    loadUser: (req, res) => {
        const token = req.params.token;

        let temp = jwt.decode(token, key);

        User.findById(temp.id).populate('history')
            .then(user => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(user);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el usuario con ese token');
            });
    }
}

module.exports = UsersController;