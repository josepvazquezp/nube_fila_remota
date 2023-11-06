const jwt = require('jsonwebtoken');

const { PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

require('dotenv').config();

const key = process.env.KEY;

const UsersController = {
    create: async function createUser(req, res) {

        let getIdCount = new GetItemCommand({
            TableName: "Users",
            Key: {
                _id: {
                    "N": "0"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);

        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let newUser;
        let insertInput;

        if (req.body.type == "Restaurante") {
            newUser = {
                _id: newId,
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                type: req.body.type,
                history: [],
                status: "ok",
                image: "../../../assets/images/logo.png",
                restaurant: ""
            };

            insertInput = {
                TableName: 'Users',
                Item: {
                    _id: {
                        N: newId.toString()
                    },
                    email: { S: req.body.email },
                    password: { S: req.body.password },
                    name: { S: req.body.name },
                    type: { S: req.body.type },
                    history: { L: [] },
                    status: { S: "ok" },
                    image: { S: "../../../assets/images/logo.png" },
                    restaurant: { N: "0" }
                }
            }
        } else {
            newUser = {
                _id: newId,
                email: req.body.email,
                password: req.body.password,
                name: req.body.name,
                type: req.body.type,
                history: [],
                status: "ok",
                image: "../../../assets/images/logo.png"
            };

            insertInput = {
                TableName: 'Users',
                Item: {
                    _id: {
                        N: newId.toString()
                    },
                    email: { S: req.body.email },
                    password: { S: req.body.password },
                    name: { S: req.body.name },
                    type: { S: req.body.type },
                    history: { L: [] },
                    status: { S: "ok" },
                    image: { S: "../../../assets/images/logo.png" }
                }
            }
        }

        let insertValue = new PutItemCommand(insertInput);

        let idUpdate = new UpdateItemCommand({
            TableName: 'Users',
            Key: {
                _id: {
                    "N": "0"
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

    update: async function updateUser(req, res) {
        const id = req.params.id;

        if (req.body.email == undefined && req.body.type == undefined &&
            (req.body.history != undefined || req.body.status != undefined ||
                req.body.image != undefined || req.body.restaurant != undefined)) {

            let updateSomeone;

            if (req.body.history != undefined) {
                updateSomeone = new UpdateItemCommand({
                    TableName: 'Users',
                    Key: {
                        _id: {
                            "N": id
                        }
                    },
                    UpdateExpression: "SET history = :h",
                    ExpressionAttributeValues: {
                        ":h": {
                            "L": req.body.history
                        }
                    },
                    ReturnValues: "ALL_NEW"
                });
            }
            else if (req.body.status != undefined) {
                updateSomeone = new UpdateItemCommand({
                    TableName: 'Users',
                    Key: {
                        _id: {
                            "N": id
                        }
                    },
                    UpdateExpression: "SET status = :s",
                    ExpressionAttributeValues: {
                        ":s": {
                            "S": req.body.status
                        }
                    },
                    ReturnValues: "ALL_NEW"
                });
            }
            else if (req.body.image != undefined) {
                updateSomeone = new UpdateItemCommand({
                    TableName: 'Users',
                    Key: {
                        _id: {
                            "N": id
                        }
                    },
                    UpdateExpression: "SET image = :i",
                    ExpressionAttributeValues: {
                        ":i": {
                            "S": req.body.image
                        }
                    },
                    ReturnValues: "ALL_NEW"
                });
            }
            else if (req.body.restaurant != undefined) {
                updateSomeone = new UpdateItemCommand({
                    TableName: 'Users',
                    Key: {
                        _id: {
                            "N": id
                        }
                    },
                    UpdateExpression: "SET restaurant = :r",
                    ExpressionAttributeValues: {
                        ":r": {
                            "N": req.body.restaurant.toString()
                        }
                    },
                    ReturnValues: "ALL_NEW"
                });
            }

            await conDBC.send(updateSomeone)
                .then(resUser => {
                    let user;

                    if (resUser.Attributes.type.S == "Restaurante") {
                        user = {
                            _id: resUser.Attributes._id.N,
                            email: resUser.Attributes.email.S,
                            password: resUser.Attributes.password.S,
                            name: resUser.Attributes.name.S,
                            type: resUser.Attributes.type.S,
                            history: resUser.Attributes.history.L,
                            status: resUser.Attributes.status.S,
                            image: resUser.Attributes.image.S,
                            restaurant: resUser.Attributes.restaurant.N,
                        }
                    }
                    else {
                        user = {
                            _id: resUser.Attributes._id.N,
                            email: resUser.Attributes.email.S,
                            password: resUser.Attributes.password.S,
                            name: resUser.Attributes.name.S,
                            type: resUser.Attributes.type.S,
                            history: resUser.Attributes.history.L,
                            status: resUser.Attributes.status.S,
                            image: resUser.Attributes.image.S
                        }
                    }

                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send(user);
                })
                .catch(error => {
                    console.log(error);
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('No se pudo actualizar el usuario');
                });
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send('No se pudo actualizar el usuario');
        }

    },

    list: async function listItems(req, res) {
        let input = {
            TableName: "Users"
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(users => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(users.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('Algo salio mal');
            });
    },

    search: async function searchUser(req, res) {
        const id = req.params.id;

        let getUser = new GetItemCommand({
            TableName: "Users",
            Key: {
                _id: {
                    "N": id
                }
            },
        });

        let resUser = await conDBC.send(getUser);

        if (resUser.Item != undefined) {
            let user;

            if (resUser.Item.type.S == "Restaurante") {
                user = {
                    _id: resUser.Item._id.N,
                    email: resUser.Item.email.S,
                    password: resUser.Item.password.S,
                    name: resUser.Item.name.S,
                    type: resUser.Item.type.S,
                    history: resUser.Item.history.L,
                    status: resUser.Item.status.S,
                    image: resUser.Item.image.S,
                    restaurant: resUser.Item.restaurant.N,
                }
            }
            else {
                user = {
                    _id: resUser.Item._id.N,
                    email: resUser.Item.email.S,
                    password: resUser.Item.password.S,
                    name: resUser.Item.name.S,
                    type: resUser.Item.type.S,
                    history: resUser.Item.history.L,
                    status: resUser.Item.status.S,
                    image: resUser.Item.image.S
                }
            }

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send(user);
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send('No se encontro el usuario: ' + id);
        }
    },

    delete: async function deleteUser(req, res) {
        const id = req.params.id;

        let input = {
            Key: {
                "_id": {
                    "N": id
                }
            },
            TableName: "Users"
        };
        let command = new DeleteItemCommand(input);
        await conDBC.send(command)
            .then(user => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(user);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el usuario: ' + id);
            });
    },

    searchCreate: async function searchC(req, res) { //Esta ruta se encarga de verificar si ya existe el email con el que se creara un nuevo usuario
        const Qemail = req.params.email;

        let input = {
            ExpressionAttributeValues: {
                ":e": {
                    "S": Qemail
                }
            },
            FilterExpression: "email = :e",
            TableName: "Users"
        };

        let command = new ScanCommand(input);
        let resUser = await conDBC.send(command);

        if (resUser.Items != undefined) {
            let user = resUser.Items;

            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send(user);
        }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send('No se encontro el usuario: ' + Qemail);
        }
    },

    searchLogin: async function getUsuarF(req, res) { //Esta ruta se encarga de verificar si el email y contraseña son correctos
        let input = {
            ExpressionAttributeValues: {
                ":e": {
                    "S": req.body.email
                },
                ":p": {
                    "S": req.body.password
                },
            },
            FilterExpression: "email = :e and password = :p",
            TableName: "Users"
        };

        let command = new ScanCommand(input);
        let resUser = await conDBC.send(command);

        if (resUser.Items[0] != undefined) {
            let user;

            if (resUser.Items[0].type.S == "Restaurante") {
                user = {
                    _id: resUser.Items[0]._id.N,
                    email: resUser.Items[0].email.S,
                    password: resUser.Items[0].password.S,
                    name: resUser.Items[0].name.S,
                    type: resUser.Items[0].type.S,
                    history: resUser.Items[0].history.L,
                    status: resUser.Items[0].status.S,
                    image: resUser.Items[0].image.S,
                    restaurant: resUser.Items[0].restaurant.N,
                }
            }
            else {
                user = {
                    _id: resUser.Items[0]._id.N,
                    email: resUser.Items[0].email.S,
                    password: resUser.Items[0].password.S,
                    name: resUser.Items[0].name.S,
                    type: resUser.Items[0].type.S,
                    history: resUser.Items[0].history.L,
                    status: resUser.Items[0].status.S,
                    image: resUser.Items[0].image.S
                }
            }

            // Si encontro al usuario, generamos el token
            const token = jwt.sign({
                id: user._id,
                name: user.name,
                email: user.email,
                type: user.type
            }, key);

            res.status(200).send({ user, token });
        }
        else {
            res.status(400).send('No se encontro el usuario');
        }
    },

    // TODO: pendiente al ya tener todo chido en dynamo y hacer getters del history
    loadUser: async function loadUser(req, res) {
        const token = req.params.token;

        let temp = jwt.decode(token, key);

        // for de history, pero hasta tener productos


        // User.findById(temp.id).populate('history')



        let getUser = new GetItemCommand({
            TableName: "Users",
            Key: {
                _id: {
                    "N": temp.id
                }
            },
        });

        await conDBC.send(getUser)
            .then(resUser => {
                let user;

                if (resUser.Item.type.S == "Restaurante") {
                    user = {
                        _id: resUser.Item._id.N,
                        email: resUser.Item.email.S,
                        password: resUser.Item.password.S,
                        name: resUser.Item.name.S,
                        type: resUser.Item.type.S,
                        history: resUser.Item.history.L,
                        status: resUser.Item.status.S,
                        image: resUser.Item.image.S,
                        restaurant: resUser.Item.restaurant.N,
                    }
                }
                else {
                    user = {
                        _id: resUser.Item._id.N,
                        email: resUser.Item.email.S,
                        password: resUser.Item.password.S,
                        name: resUser.Item.name.S,
                        type: resUser.Item.type.S,
                        history: resUser.Item.history.L,
                        status: resUser.Item.status.S,
                        image: resUser.Item.image.S
                    }
                }

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