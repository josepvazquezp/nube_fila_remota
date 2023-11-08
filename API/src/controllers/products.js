const Product = require('./../models/product');
const Restaurant = require('./../models/restaurant');

const { PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

const ProductsController = {
    create: async function createProduct(req, res) {
        let getIdCount = new GetItemCommand({
            TableName: "Products",
            Key: {
                _id: {
                    "N": "0"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);

        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let newProduct = {
            _id: newId,
            Name: req.body.Name,
            Description: req.body.Description,
            Price: req.body.Price,
            Available: true,
            Image: "default",
            RestaurantId: req.body.RestaurantId
        };

        let insertValue = new PutItemCommand({
            TableName: 'Products',
            Item: {
                _id: {
                    N: newId.toString()
                },
                Name: { S: req.body.Name },
                Description: { S: req.body.Description },
                Price: { N: req.body.Price.toString() },
                Available: { BOOL: true },
                Image: { S: "default" },
                RestaurantId: { N: req.body.RestaurantId.toString() }
            }
        });

        let idUpdate = new UpdateItemCommand({
            TableName: 'Products',
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
            .then(async function resProduct(product) {
                let getRestaurant = new GetItemCommand({
                    TableName: "Restaurants",
                    Key: {
                        _id: {
                            "N": req.body.RestaurantId
                        }
                    },
                });

                await conDBC.send(getRestaurant)
                    .then(async function resR(restaurant) {
                        let products = restaurant.Item.products.L;
                        products.push(newId);

                        updateInput = new UpdateItemCommand({
                            TableName: 'Restaurants',
                            Key: {
                                _id: {
                                    "N": req.body.RestaurantId.toString()
                                }
                            },
                            UpdateExpression: "SET products = list_append(products, :p)",
                            ExpressionAttributeValues: {
                                ":p": {
                                    "L": [
                                        {
                                            "N": newId.toString()
                                        }
                                    ]
                                }
                            },
                            ReturnValues: "ALL_NEW"
                        });


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

                                let product = newProduct;

                                res.status(201).send({ product, restaurant });
                            })
                            .catch(error => {
                                res.status(400).send('No se pudo actualizar el restaurant');
                            });
                    })
                    .catch(error => {
                        res.status(400).send('No se encontro al restaurante con ID: ' + req.body.RestaurantId);
                    });

            })
            .catch(error => {
                res.status(400).send('El producto no pudo ser registrado');
            });
    },

    update: async function updateP(req, res) {
        const id = req.params.id;

        // req.body.Name    req.body.Description    req.body.Available  req.body.Price  req.body.Image

        if (req.body != null) {
            let start = false;
            let updateExpression = 'SET ';
            let atributeValues = '{';
            let atributeNames = '{';


            if (req.body.Name != undefined) {
                updateExpression += '#N = :n';
                atributeNames += '"#N":"Name"';
                atributeValues += '":n":{"S":"' + req.body.Name + '"}';

                start = true;
            }

            if (req.body.Description != undefined) {
                if (start) {
                    updateExpression += ' , #D = :d';
                    atributeNames += ', "#D":"Description"';
                    atributeValues += ', ":d":{"S":"' + req.body.Description + '"}';
                }
                else {
                    updateExpression += '#D = :d';
                    atributeNames += '"#D":"Description"';
                    atributeValues += '":d":{"S":"' + req.body.Description + '"}';

                    start = true;
                }
            }

            if (req.body.Available != undefined) {
                if (start) {
                    updateExpression += ' , #A = :a';
                    atributeNames += ', "#A":"Available"';
                    atributeValues += ', ":a":{"BOOL":"' + req.body.Available + '"}';
                }
                else {
                    updateExpression += '#A = :a';
                    atributeNames += '"#A":"Available"';
                    atributeValues += '":a":{"BOOL":"' + req.body.Available + '"}';

                    start = true;
                }
            }

            if (req.body.Price != undefined) {
                if (start) {
                    updateExpression += ' , #P = :p';
                    atributeNames += ', "#P":"Price"';
                    atributeValues += ', ":p":{"N":"' + req.body.Price + '"}';
                }
                else {
                    updateExpression += '#P = :p';
                    atributeNames += '"#P":"Price"';
                    atributeValues += '":p":{"N":"' + req.body.Price + '"}';

                    start = true;
                }
            }

            if (req.body.Image != undefined) {
                if (start) {
                    updateExpression += ' , #I = :i';
                    atributeNames += ', "#I":"Image"';
                    atributeValues += ', ":i":{"S":"' + req.body.Image + '"}';
                }
                else {
                    updateExpression += '#I = :i';
                    atributeNames += '"#I":"Image"';
                    atributeValues += '":i":{"S":"' + req.body.Image + '"}';

                    start = true;
                }
            }

            atributeValues += '}';
            atributeNames += '}';

            updateInput = new UpdateItemCommand({
                TableName: 'Products',
                Key: {
                    _id: {
                        "N": id
                    }
                },
                UpdateExpression: updateExpression,
                ExpressionAttributeValues: JSON.parse(atributeValues),
                ExpressionAttributeNames: JSON.parse(atributeNames),
                ReturnValues: "ALL_NEW"
            });

            await conDBC.send(updateInput)
                .then(resProduct => {
                    let product = {
                        _id: resProduct.Attributes._id.N,
                        Name: resProduct.Attributes.Name.S,
                        Description: resProduct.Attributes.Description.S,
                        Price: resProduct.Attributes.Price.N,
                        Available: resProduct.Attributes.Available.BOOL,
                        Image: resProduct.Attributes.Image.S,
                        RestaurantId: resProduct.Attributes.RestaurantId.N
                    }

                    res.status(200).send(product);
                })
                .catch(error => {
                    res.status(400).send('No se pudo actualizar el producto');
                });
        }
        else {
            res.status(400).send('No se pudo actualizar el producto');
        }
    },

    list: async function listProducts(req, res) {
        let input = {
            TableName: "Products"
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(product => {
                res.status(200).send(product);
            })
            .catch(error => {
                res.status(400).send('No se encontraron los productos');
            });
    },

    search: async function searchProduct(req, res) {
        const id = req.params.id;

        let getProduct = new GetItemCommand({
            TableName: "Products",
            Key: {
                _id: {
                    "N": id
                }
            },
        });

        await conDBC.send(getProduct)
            .then(async function resP(resProduct) {
                let getRestaurant = new GetItemCommand({
                    TableName: "Restaurants",
                    Key: {
                        _id: {
                            "N": resProduct.Item.RestaurantId.N
                        }
                    },
                });

                await conDBC.send(getRestaurant)
                    .then(async function resR(resRestaurant) {
                        let restaurant = {
                            _id: resRestaurant.Item._id.N,
                            name: resRestaurant.Item.name.S,
                            products: resRestaurant.Item.products.L,
                            description: resRestaurant.Item.description.S,
                            type: resRestaurant.Item.type.S,
                            location: resRestaurant.Item.location.S,
                            image: resRestaurant.Item.image.S,
                            orders: resRestaurant.Item.orders.L
                        };

                        let product = {
                            _id: resProduct.Item._id.N,
                            Name: resProduct.Item.Name.S,
                            Description: resProduct.Item.Description.S,
                            Price: resProduct.Item.Price.N,
                            Available: resProduct.Item.Available.BOOL,
                            Image: resProduct.Item.Image.S,
                            RestaurantId: restaurant
                        };

                        res.status(200).send(product);
                    })
                    .catch(error => {
                        res.status(400).send('No se encontro al producto con ID: ' + id);
                    });
            })
            .catch(error => {
                res.status(400).send('No se encontro al producto con ID: ' + id);
            });
    },

    delete: async function delP(req, res) {
        const id = req.params.id;

        let getProduct = new GetItemCommand({
            TableName: "Products",
            Key: {
                _id: {
                    "N": id
                }
            },
        });

        await conDBC.send(getProduct)
            .then(async function resP(resProduct) {
                let getRestaurant = new GetItemCommand({
                    TableName: "Restaurants",
                    Key: {
                        _id: {
                            "N": resProduct.Item.RestaurantId.N
                        }
                    },
                });

                await conDBC.send(getRestaurant)
                    .then(async function resR(resRestaurant) {
                        let products = resRestaurant.Item.products.L;
                        let index = products.findIndex(item => item.N == id);

                        let input = {
                            Key: {
                                "_id": {
                                    "N": id
                                }
                            },
                            TableName: "Products"
                        };

                        let command = new DeleteItemCommand(input);
                        await conDBC.send(command)
                            .then(async function resPDel(response) {
                                let updateInput = new UpdateItemCommand({
                                    TableName: 'Restaurants',
                                    Key: {
                                        _id: {
                                            "N": resProduct.Item.RestaurantId.N
                                        }
                                    },
                                    UpdateExpression: 'REMOVE products[' + index + ']',
                                    ReturnValues: "ALL_NEW"
                                });

                                await conDBC.send(updateInput)
                                    .then(resUpdateR => {
                                        let temp;
                                        let products = [];

                                        for (let i = 0; i < resUpdateR.Attributes.products.L.length; i++) {
                                            temp = resUpdateR.Attributes.products.L[i].N;

                                            products.push(temp);
                                        }

                                        let restaurant = {
                                            _id: resUpdateR.Attributes._id.N,
                                            name: resUpdateR.Attributes.name.S,
                                            products: products,
                                            description: resUpdateR.Attributes.description.S,
                                            type: resUpdateR.Attributes.type.S,
                                            location: resUpdateR.Attributes.location.S,
                                            image: resUpdateR.Attributes.image.S,
                                            orders: resUpdateR.Attributes.orders.L
                                        }

                                        let product = {
                                            _id: resProduct.Item._id.N,
                                            Name: resProduct.Item.Name.S,
                                            Description: resProduct.Item.Description.S,
                                            Price: resProduct.Item.Price.N,
                                            Available: resProduct.Item.Available.BOOL,
                                            Image: resProduct.Item.Image.S,
                                            RestaurantId: resProduct.Item.RestaurantId.N
                                        };

                                        res.status(201).send({ product, restaurant });
                                    })
                                    .catch(error => {
                                        res.status(400).send('No se encontro al restaurante con ID: ' + resProduct.Item.RestaurantId.N);
                                    });
                            })
                            .catch(error => {
                                res.status(400).send('No se encontro al producto con ID:' + id);
                            });

                    })
                    .catch(error => {
                        res.status(400).send('No se encontro al producto con ID: ' + id);
                    });
            })
            .catch(error => {
                res.status(400).send('No se encontro al producto con ID: ' + id);
            });


    },
    search_in: async function filterP(req, res) {
        const filter = req.params.filter;

        let input = {
            ExpressionAttributeNames: {
                "#N": "Name",
            },
            ExpressionAttributeValues: {
                ":f": {
                    "S": filter
                }
            },
            FilterExpression: "contains(#N, :f)",
            TableName: "Products"
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(resProducts => {
                let products = [];
                let temp;

                for (let i = 0; i < resProducts.Items.length; i++) {
                    temp = {
                        _id: resProducts.Items[i]._id.N,
                        Name: resProducts.Items[i].Name.S,
                        Description: resProducts.Items[i].Description.S,
                        Price: resProducts.Items[i].Price.N,
                        Available: resProducts.Items[i].Available.BOOL,
                        Image: resProducts.Items[i].Image.S,
                        RestaurantId: resProducts.Items[i].RestaurantId.N
                    }

                    products.push(temp);
                }

                res.status(200).send(products);
            })
            .catch(error => {
                res.status(400).send('No se encontro ningun restaurant con: ' + filter);
            });
    }
}

module.exports = ProductsController;