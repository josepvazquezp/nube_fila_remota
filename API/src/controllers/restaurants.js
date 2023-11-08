const { PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

const RestaurantsController = {
    create: async function createRestaurant(req, res) {
        let getIdCount = new GetItemCommand({
            TableName: "Restaurants",
            Key: {
                _id: {
                    "N": "0"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);

        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let newRestaurant = {
            _id: newId,
            name: req.body.name,
            products: [],
            description: req.body.description,
            type: req.body.type,
            location: req.body.location,
            image: "../../../assets/images/logo.png",
            orders: []
        };

        let insertValue = new PutItemCommand({
            TableName: 'Restaurants',
            Item: {
                _id: {
                    N: newId.toString()
                },
                name: { S: req.body.name },
                products: { L: [] },
                description: { S: req.body.description },
                type: { S: req.body.type },
                location: { S: req.body.location },
                image: { S: "../../../assets/images/logo.png" },
                orders: { L: [] }
            }
        });

        let idUpdate = new UpdateItemCommand({
            TableName: 'Restaurants',
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

        await conDBC.send(insertValue)
            .then(restaurant => {
                res.status(201).send(newRestaurant);
            })
            .catch(error => {
                res.status(400).send('No se pudo crear el restaurant');
            });
    },

    update: async function updateRestaurant(req, res) {
        const id = req.params.id;

        // req.body.image req.body.description req.body.products req.body.orders
        let updateInput;

        if (req.body.image != undefined && req.body.description != undefined) {
            updateInput = new UpdateItemCommand({
                TableName: 'Restaurants',
                Key: {
                    _id: {
                        "N": id
                    }
                },
                UpdateExpression: "SET image = :i, description = :d",
                ExpressionAttributeValues: {
                    ":i": {
                        "S": req.body.image
                    },
                    ":d": {
                        "S": req.body.description
                    }
                },
                ReturnValues: "ALL_NEW"
            });
        }
        else if (req.body.image != undefined) {
            updateInput = new UpdateItemCommand({
                TableName: 'Restaurants',
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
        else if (req.body.description != undefined) {
            updateInput = new UpdateItemCommand({
                TableName: 'Restaurants',
                Key: {
                    _id: {
                        "N": id
                    }
                },
                UpdateExpression: "SET description = :d",
                ExpressionAttributeValues: {
                    ":d": {
                        "S": req.body.description
                    }
                },
                ReturnValues: "ALL_NEW"
            });
        }
        else if (req.body.products != undefined) {
            updateInput = new UpdateItemCommand({
                TableName: 'Restaurants',
                Key: {
                    _id: {
                        "N": id
                    }
                },
                UpdateExpression: "SET products = :p",
                ExpressionAttributeValues: {
                    ":p": {
                        "L": req.body.products
                    }
                },
                ReturnValues: "ALL_NEW"
            });
        }
        else if (req.body.orders != undefined) {
            updateInput = new UpdateItemCommand({
                TableName: 'Restaurants',
                Key: {
                    _id: {
                        "N": id
                    }
                },
                UpdateExpression: "SET orders = :o",
                ExpressionAttributeValues: {
                    ":o": {
                        "L": req.body.orders
                    }
                },
                ReturnValues: "ALL_NEW"
            });
        }

        await conDBC.send(updateInput)
            .then(resRestaurant => {
                let restaurant = {
                    _id: resRestaurant.Attributes._id.N,
                    name: resRestaurant.Attributes.name.S,
                    products: resRestaurant.Attributes.products.L,
                    description: resRestaurant.Attributes.description.S,
                    type: resRestaurant.Attributes.type.S,
                    location: resRestaurant.Attributes.location.S,
                    image: resRestaurant.Attributes.image.S,
                    orders: resRestaurant.Attributes.orders.L
                }

                res.status(200).send(restaurant);
            })
            .catch(error => {
                res.status(400).send('No se pudo actualizar el restaurant');
            });
    },

    list: async function listRestaurants(req, res) {
        let input = {
            TableName: "Restaurants"
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(restaurants => {
                res.status(200).send(restaurants);
            })
            .catch(error => {
                res.status(400).send('Algo salio mal');
            });
    },

    search: async function searchRestaurant(req, res) {
        const id = req.params.id;

        let getRestaurant = new GetItemCommand({
            TableName: "Restaurants",
            Key: {
                _id: {
                    "N": id
                }
            },
        });

        await conDBC.send(getRestaurant)
            // DENTRO DE PROMESA POPULATE DE products y orders

            .then(async function reqRestaurant(resRestaurant) {
                let restaurant = {
                    _id: resRestaurant.Item._id.N,
                    name: resRestaurant.Item.name.S,
                    products: resRestaurant.Item.products.L,
                    description: resRestaurant.Item.description.S,
                    type: resRestaurant.Item.type.S,
                    location: resRestaurant.Item.location.S,
                    image: resRestaurant.Item.image.S,
                    orders: resRestaurant.Item.orders.L
                }

                let getProduct;
                let products = [];
                let temp;
                let i;

                for (i = 0; i < resRestaurant.Item.products.L.length; i++) {
                    getProduct = new GetItemCommand({
                        TableName: "Products",
                        Key: {
                            _id: {
                                "N": resRestaurant.Item.products.L[i].N
                            }
                        },
                    });

                    await conDBC.send(getProduct)
                        .then(async function resP(resProduct) {
                            temp = {
                                _id: resProduct.Item._id.N,
                                Name: resProduct.Item.Name.S,
                                Description: resProduct.Item.Description.S,
                                Price: resProduct.Item.Price.N,
                                Available: resProduct.Item.Available.BOOL,
                                Image: resProduct.Item.Image.S,
                                RestaurantId: resProduct.Item.RestaurantId.N
                            };

                            products.push(temp);
                        })
                        .catch(error => {
                            res.status(400).send('No se encontro al producto con ID: ' + resRestaurant.Item.products.L[i].N);
                        });
                }

                let getOrder;
                let orders = [];

                for (i = 0; i < resRestaurant.Item.orders.L.length; i++) {
                    getOrder = new GetItemCommand({
                        TableName: "Orders",
                        Key: {
                            _id: {
                                "N": resRestaurant.Item.orders.L[i].N
                            }
                        },
                    });

                    await conDBC.send(getOrder)
                        .then(async function resO(resOrder) {
                            temp = {
                                _id: resOrder.Item._id.N,
                                customerId: resOrder.Item.customer_id.N,
                                restaurantId: resOrder.Item.restaurant_id.N,
                                total: resOrder.Item.total.N,
                                status: resOrder.Item.status.S,
                                products: resOrder.Item.products.L,
                                quantity: resOrder.Item.quantity.N
                            };

                            orders.push(temp);
                        })
                        .catch(error => {
                            res.status(400).send('No se encontro al producto con ID: ' + resRestaurant.Item.orders.L[i].N);
                        });
                }

                restaurant.products = products;
                restaurant.orders = orders;

                res.status(200).send(restaurant);
            })
            .catch(error => {
                res.status(400).send('No se encontro el restaurant: ' + id);
            });
    },

    delete: async function deleteRestaurant(req, res) {
        const id = req.params.id;

        let getRestaurant = new GetItemCommand({
            TableName: "Restaurants",
            Key: {
                _id: {
                    "N": id
                }
            },
        });

        await conDBC.send(getRestaurant)
            .then(async function getR(resRestaurant) {
                let restaurant = {
                    _id: resRestaurant.Item._id.N,
                    name: resRestaurant.Item.name.S,
                    products: resRestaurant.Item.products.L,
                    description: resRestaurant.Item.description.S,
                    type: resRestaurant.Item.type.S,
                    location: resRestaurant.Item.location.S,
                    image: resRestaurant.Item.image.S,
                    orders: resRestaurant.Item.orders.L
                }

                let input;
                let command;

                for (let i = 0; i < resRestaurant.Item.products.L.length; i++) {
                    input = {
                        Key: {
                            "_id": {
                                "N": resRestaurant.Item.products.L[i].N
                            }
                        },
                        TableName: "Products"
                    };

                    command = new DeleteItemCommand(input);


                    await conDBC.send(command);

                }

                input = {
                    Key: {
                        "_id": {
                            "N": id
                        }
                    },
                    TableName: "Restaurants"
                };

                command = new DeleteItemCommand(input);

                await conDBC.send(command)
                    .then(response => {
                        res.status(200).send(restaurant);
                    })
                    .catch(error => {
                        res.status(400).send('No se encontro el restaurant: ' + id);
                    });

            })
            .catch(error => {
                res.status(400).send('No se encontro el restaurant: ' + id);
            });
    },
    category: async function searchByCat(req, res) {
        const type = req.body.type;

        let input = {
            ExpressionAttributeNames: {
                "#T": "type"
            },
            ExpressionAttributeValues: {
                ":t": {
                    "S": type
                }
            },
            FilterExpression: "#T = :t",
            TableName: "Restaurants"
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(resRestaurants => {

                let restaurants = [];

                for (let i = 0; i < resRestaurants.Items.length; i++) {
                    let temp = {
                        _id: resRestaurants.Items[i]._id.N,
                        name: resRestaurants.Items[i].name.S,
                        products: resRestaurants.Items[i].products.L,
                        description: resRestaurants.Items[i].description.S,
                        type: resRestaurants.Items[i].type.S,
                        location: resRestaurants.Items[i].location.S,
                        image: resRestaurants.Items[i].image.S,
                        orders: resRestaurants.Items[i].orders.L
                    }

                    restaurants.push(temp);
                }

                res.status(200).send(restaurants);
            })
            .catch(error => {
                res.status(400).send('No se encontro el restaurant con type: ' + type);
            });

    },
    search_in: async function searchFilter(req, res) {
        const filter = req.params.filter;

        let input = {
            ExpressionAttributeNames: {
                "#N": "name",
            },
            ExpressionAttributeValues: {
                ":f": {
                    "S": filter
                }
            },
            FilterExpression: "contains(#N, :f)",
            TableName: "Restaurants"
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(resRestaurants => {
                let restaurants = [];

                for (let i = 0; i < resRestaurants.Items.length; i++) {
                    let temp = {
                        _id: resRestaurants.Items[i]._id.N,
                        name: resRestaurants.Items[i].name.S,
                        products: resRestaurants.Items[i].products.L,
                        description: resRestaurants.Items[i].description.S,
                        type: resRestaurants.Items[i].type.S,
                        location: resRestaurants.Items[i].location.S,
                        image: resRestaurants.Items[i].image.S,
                        orders: resRestaurants.Items[i].orders.L
                    }

                    restaurants.push(temp);
                }

                res.status(200).send(restaurants);
            })
            .catch(error => {
                res.status(400).send('No se encontro ningun restaurant con: ' + filter);
            });
    }
}

module.exports = RestaurantsController;