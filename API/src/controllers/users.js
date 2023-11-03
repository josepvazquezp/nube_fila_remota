const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const User = require('./../models/user');

const { PutItemCommand, GetItemCommand, UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

require('dotenv').config();

const googleClient = new OAuth2Client(process.env.GOOGLE_ID);

const key = process.env.KEY;

const UsersController = {
    create: async function createUser(req, res) {

        let getIdCount = new GetItemCommand({
            TableName: "Users",
            Key: {
                email: {
                    "S": "IdCount"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);

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
                    N: resIdCount.Item.IdCount.N
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

        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let idUpdate = new UpdateItemCommand({
            TableName: 'Users',
            Key: {
                email: {
                    "S": "IdCount"
                }
            },
            UpdateExpression: "SET IdCount = :c",
            ExpressionAttributeValues: {
                ":c": {
                    "N": newId.toString()
                }
            },
            ReturnValues: "ALL_NEW"
        });

        await conDBC.send(idUpdate);

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

        let resUser = await conDBC.send(getUser);

        let user = {
            id: resUser.Item.id.N,
            email: resUser.Item.email.S,
            password: resUser.Item.password.S,
            name: resUser.Item.name.S,
            type: resUser.Item.type.S,
            history: resUser.Item.history.L,
            status: resUser.Item.status.S,
            image: resUser.Item.image.S
        }


        if (resUser != undefined) {
            // Si encontro al usuario, generamos el token
            const token = jwt.sign({
                id: user.id,
                name: user.name,
                email: user.email,
                type: user.type
            }, key);

            console.log(user);

            res.status(200).send({ user, token });
        }
        else {
            res.status(400).send('No se encontro el usuario');
        }
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