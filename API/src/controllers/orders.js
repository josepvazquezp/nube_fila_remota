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

        // console.log("Orden");
        // console.log(newOrder.products[0]);

        
        //Se reciben bien desde Swagger


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

                                M : 
                                    {
                                    product:{M: {
                                        _id: {N: req.body.product._id},
                                        name: {S: req.body.product.Name},
                                        description: {S: req.body.product.Description},
                                        price: {N: req.body.product.Price},
                                        available: {BOOL: req.body.product.Available},
                                        imagen: {S: req.body.product.Image},
                                        restaurant_id: {S: req.body.product.RestaurantId},
                                            }
                                        },
                                    quantity: {N : req.body.quantity}
                                },
                        
                    },
                ],
            }
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

        // console.log(insertValue.input.Item.products.L[0].productin.M);
        // console.log(insertValue.input.Item.products.L[0].productin.M._id.N);
        // console.log(insertValue.input.Item.products.L[0].productin.M.name.S);
        // console.log(insertValue.input.Item.products.L[0].productin.M.description.S);
        // console.log(insertValue.input.Item.products.L[0].productin.M.price.N);
        // console.log(insertValue.input.Item.products.L[0].productin.M.available.BOOL);
        // console.log(insertValue.input.Item.products.L[0].productin.M.imagen.S);
        // console.log(insertValue.input.Item.products.L[0].productin.M.restaurant_id.S);
        // console.log(insertValue.input.Item.products.L[0].productin.M.quantity.N);


        

        await conDBC.send(idUpdate);


        //Primero se hace el general; crear orden
        //Se encuentra al customer y se le hace push al arreglo
        //No se le hace push, se le baja su history, se cambia y se manda
        //Primero: Get
        //Segundo: Put
        

        await conDBC.send(insertValue).then( async function resOrder(order) {
                console.log("Orden Creada");

                //Get del User
                let getUser = new GetItemCommand({
                    TableName: "Users",
                    Key: {
                        _id: {
                            "N": insertValue.input.Item.customer_id.N
                        }
                    },
                });
        
                let resUser = await conDBC.send(getUser);

                console.log("Usuario");
                console.log(resUser);

                let user;
                
        
                if (resUser.Item != undefined) {
                    
        
                    if (resUser.Item.type.S == "Restaurant") {
                        user = {
                            _id: resUser.Item._id.N,
                            email: resUser.Item.email.S,
                            password: resUser.Item.password.S,
                            name: resUser.Item.name.S,
                            type: resUser.Item.type.S,
                            history: resUser.Item.history.L,
                            status: resUser.Item.status.S,
                            image: resUser.Item.image.S,
                            restaurant: resUser.Item.restaurant.S,
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
                }

                //Obtener el historial
                console.log(user);
                console.log("Historial antes de Push");
                console.log(user.history);
                console.log("");

                user.history.push(newOrder);

                console.log("Historial despues de Push");
                console.log(user.history);
                console.log("");


                //Update para meter la nueva orden
                update_user_history = new UpdateItemCommand({
                    TableName: 'Users',
        
                    ExpressionAttributeValues: {
                        ":msgn": {
                            L :[{M:{_id: {
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
            
                                            M : 
                                                {
                                                product:{M: {
                                                    _id: {N: req.body.product._id},
                                                    name: {S: req.body.product.Name},
                                                    description: {S: req.body.product.Description},
                                                    price: {N: req.body.product.Price},
                                                    available: {BOOL: req.body.product.Available},
                                                    imagen: {S: req.body.product.Image},
                                                    restaurant_id: {S: req.body.product.RestaurantId},
                                                        }
                                                    },
                                                quantity: {N : req.body.quantity}
                                            },
                                    
                                },
                            ],
                        }}}]
            }
            ,},
                    Key: {
                        _id: {
                            "N":  user._id
                        }
                    },
                    UpdateExpression: "SET history = list_append(history, :msgn)",
                    ReturnValues: "ALL_NEW"
                });

                
                
                console.log("=====================================")


                await conDBC.send(update_user_history)
                .then(resUser => {
                    console.log("Se actualizó el historial del cliente");

                    let user;

                    if (resUser.Attributes.type.S == "Restaurant") {
                        user = {
                            _id: resUser.Attributes._id.N,
                            email: resUser.Attributes.email.S,
                            password: resUser.Attributes.password.S,
                            name: resUser.Attributes.name.S,
                            type: resUser.Attributes.type.S,
                            history: resUser.Attributes.history.L,
                            status: resUser.Attributes.status.S,
                            image: resUser.Attributes.image.S,
                            restaurant: resUser.Attributes.restaurant.S,
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
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('No se pudo actualizar el usuario Error: ' + error);
                });
                res.status(201).send(order.Items);
            }
        )
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se pudo crear la orden Error: ' + error);
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
    
    list: async function list_orders(req, res) {

        let input = {
            TableName: "Orders"
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(orders => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(orders.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se pudieron obtener las ordenes');
            });



        // Order.find({})
        //         .then(orders => {
        //             res.status(200).send(orders);
        //         })
        //         .catch(error => {
        //             res.status(400).send('Algo salio mal');
        //         });
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

    delete: async function delete_order (req, res) {
        const id = req.params.id;


        let input = {
            Key: {
                "_id": {
                    "N": id
                }
            },
            TableName: "Orders"
        };

        let command = new DeleteItemCommand(input);
        await conDBC.send(command)
            .then(card => {
                
                console.log(card)

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(card.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro la tarjeta con ID:' + id);
            });


        // Order.findByIdAndDelete(id)
        //                         .then(order => {
        //                             User.findById(order.customerId)
        //                                 .then(user => {
        //                                 let orders = user.history;
        //                                 let index = orders.findIndex(item => item == order.id);

        //                                 orders.splice(index, 1);

        //                                 let body = JSON.parse(JSON.stringify({history: orders}));

        //                                 User.findByIdAndUpdate(order.customerId, body, {new:true})
        //                                     .then(user => {
        //                                         res.status(201).send({order, user});
        //                                     })
        //                                     .catch(error => {
        //                                         res.status(400).send('No se pudo actualizar el usuario');
        //                                     });
        //                                 })
        //                                 .catch(error => {
        //                                     res.status(400).send('No se encontro al usuario con ID: ' + order.customerId);
        //                                 });
        //                         })
        //                         .catch(error => {
        //                             res.status(400).send('No se encontro la orden: ' + id);
        //                         });
    }
}

module.exports = OrdersController;