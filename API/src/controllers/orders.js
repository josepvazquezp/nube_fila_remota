const Order = require('./../models/order');
const User = require('./../models/user');

const UserController = require("./../controllers/users");


const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const { PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

const OrdersController = {
    create: async function create_order (req, res) {
        let newOrder = {
            customerId: req.body.customerId,
            restaurantId: req.body.restaurantId,
            total: req.body.total,
            status: "creada",
            products: [{product: req.body.product, quantity: req.body.quantity}],
            quantity: req.body.quantity
        };



        let getIdCount = new GetItemCommand({
            TableName: "Orders",
            Key: {
                _id: {
                    "N": "0"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);
        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let insertValue = new PutItemCommand({
            TableName: 'Orders',
            Item: {
                _id: {
                    N: newId.toString()
                },
                customer_id: { N: req.body.customerId },
                restaurant_id: {N: req.body.restaurantId},
                total: {N: req.body.total},
                status: {S: "creada"},
                quantity: {N: req.body.quantity},
                products: {
                        L: [
                            {
                                productin:{M : {
                                    name: {S: req.body.product.Name},
                                    description: {S: req.body.product.Description},
                                    price: {N: req.body.product.Price},
                                    available: {BOOL: req.body.product.Available},
                                    imagen: {S: req.body.product.Image},
                                    restaurant_id: {S: req.body.product.RestaurantId},
                                    quantity: {N : req.body.quantity}
                                },
                        } 
                    },
                ],
            },
            }
        });

        let idUpdate = new UpdateItemCommand({
            TableName: 'Orders',
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

        //await conDBC.send(idUpdate);


        //Primero se hace el general; crear orden
        //Se encuentra al customer y se le hace push al arreglo
        //No se le hace push, se le baja su history, se cambia y se manda
        //Primero: Get
        //Segundo: Put
        

        await conDBC.send(insertValue).then(order => {

                UserController.search()





                res.status(201).send(order.Items);
            }
        )
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se pudo crear la orden');
            },
        );





        // Order(newOrder).save()
        //                 .then(order => {
        //                         //=================================================================
        //                     User.findById(req.body.customerId)
        //                         .then(user => {
        //                         let orders = user.history;
        //                         orders.push(order.id);

        //                         let body = JSON.parse(JSON.stringify({history: orders}));
                                
        //                             //=================================================================
        //                         User.findByIdAndUpdate(req.body.customerId, body, {new:true})
        //                             .then(user => {
        //                                 res.status(201).send({order, user});
        //                             })
        //                             .catch(error => {
        //                                 res.status(400).send('No se pudo actualizar el usuario');
        //                             });
        //                             //=================================================================
        //                         })
        //                         //=================================================================

        //                         .catch(error => {
        //                             res.status(400).send('No se encontro el usuario con ID: ' + req.body.customerId);
        //                         });
        //                 })
        //                 .catch(error => {
        //                     res.status(400).send('No se pudo crear la orden');
        //                 });
    },

    update: (req, res) => {
        const id = req.params.id;

        Order.findByIdAndUpdate(id, req.body, {new:true})
                        .then(order => {
                            res.status(200).send(order);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo actualizar la orden');
                        });
    },
    
    list: (req, res) => {
        Order.find({})
                .then(orders => {
                    res.status(200).send(orders);
                })
                .catch(error => {
                    res.status(400).send('Algo salio mal');
                });
    },
    
    search: (req, res) => {
        const id = req.params.id;
        Order.findById(id).populate('products.product')
                .then(order => {
                    res.status(200).send(order);
                })
                .catch(error => {
                    res.status(400).send('No se encontro la orden: ' + id);
                });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Order.findByIdAndDelete(id)
                                .then(order => {
                                    User.findById(order.customerId)
                                        .then(user => {
                                        let orders = user.history;
                                        let index = orders.findIndex(item => item == order.id);

                                        orders.splice(index, 1);

                                        let body = JSON.parse(JSON.stringify({history: orders}));

                                        User.findByIdAndUpdate(order.customerId, body, {new:true})
                                            .then(user => {
                                                res.status(201).send({order, user});
                                            })
                                            .catch(error => {
                                                res.status(400).send('No se pudo actualizar el usuario');
                                            });
                                        })
                                        .catch(error => {
                                            res.status(400).send('No se encontro al usuario con ID: ' + order.customerId);
                                        });
                                })
                                .catch(error => {
                                    res.status(400).send('No se encontro la orden: ' + id);
                                });
    }
}

module.exports = OrdersController;