const Rating = require('./../models/rating');

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const { PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

const RatingController = {
    create: async function create_rating(req, res) {
        let newRating = {
            ID_Evaluator: req.body.ID_Evaluator,
            ID_Evaluated: req.body.ID_Evaluated,
            ID_Order: req.body.ID_Order,
            Rating: req.body.Rating, //number
            Description: req.body.Description
        };


        let getIdCount = new GetItemCommand({
            TableName: "Ratings",
            Key: {
                _id: {
                    "N": "0"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);
        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let insertValue = new PutItemCommand({
            TableName: 'Ratings',
            Item: {
                _id: {
                    N: newId.toString()
                },
                id_evaluator: { N: req.body.ID_Evaluator.toString() },
                id_evaluated: { N: req.body.ID_Evaluated.toString() },
                id_order: { N: req.body.ID_Order.toString() },
                rating: { N: req.body.Rating.toString() },
                description: { S: req.body.Description },
            }
        });

        let idUpdate = new UpdateItemCommand({
            TableName: 'Ratings',
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

        console.log(insertValue.input);

        await conDBC.send(insertValue).then(rating => {
            res.status(201).send(rating.Items);
        })
            .catch(error => {
                console.log(error);
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se pudo asignar la calificación');
            });
    },
    //==============================================================================
    //==============================================================================
    //TODO: Este no se usa tons despues veo
    update: (req, res) => {
        const id = req.params.id;

        if (req.body != null && req.body.ID_Evaluator == undefined && req.body.ID_Evaluated == undefined) {
            Rating.findByIdAndUpdate(id, req.body, { new: true })
                .then(rating => {
                    res.status(200).send(rating);
                })
                .catch(error => {
                    res.status(400).send('No se pudieron actualizar los datos de la calificación');
                });
        }
        else {
            res.status(400).send('No se pudieron actualizar los datos de la calificación');
        }
    },
    //==============================================================================
    //==============================================================================
    list: async function list_reviews(req, res) {
        let input = {
            TableName: "Ratings"
        };


        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(ratings => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(ratings.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('Algo salio mal');
            });



        // Rating.find({})
        //         .then(rating => {
        //             res.status(200).send(rating);
        //         })
        //         .catch(error => {
        //             res.status(400).send('No se encontraron reseñas');
        //         });
    },
    //==============================================================================
    //==============================================================================
    search: async function search_rating(req, res) {


        const id = req.params.id;

        let input = {
            TableName: "Ratings",
            "ExpressionAttributeNames": {
                "#IDD": "_id"
            },
            "ExpressionAttributeValues": {
                ":idd": {
                    "N": id
                }
            },
            "FilterExpression": "#IDD = :idd",
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(rating => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(rating.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro la reseña con ID: ' + id);
            });



        // Rating.findById(id)
        //         .then(rating => {
        //             res.status(200).send(rating);
        //         })
        //         .catch(error => {
        //             res.status(400).send('No se encontro la reseña con ID: ' + id);
        //         });
    },
    //==============================================================================
    //==============================================================================
    delete: async function delete_rating(req, res) {
        const id = req.params.id;

        let input = {
            Key: {
                "_id": {
                    "N": id
                }
            },
            TableName: "Ratings"
        };

        let command = new DeleteItemCommand(input);
        await conDBC.send(command)
            .then(rating => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(rating.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro la reseña con ID:' + id);
            });

        // Rating.findByIdAndDelete(id)
        //                         .then(rating => {
        //                             res.status(200).send(rating);
        //                         })
        //                         .catch(error => {
        //                             res.status(400).send('No se encontro la reseña con ID:' + id);
        //                         });
    },
    //==============================================================================
    //==============================================================================
    listMineR: async function list_mine_r(req, res) {
        const id = req.params.id;


        let input = {
            TableName: "Ratings",
            "ExpressionAttributeNames": {
                "#IDD": "id_evaluated"
            },
            "ExpressionAttributeValues": {
                ":idd": {
                    "N": id
                }
            },
            "FilterExpression": "#IDD = :idd",
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(ratings => {

                let temp = [];

                for (let i = 0; i < ratings.Count; i++) {
                    temp.push({
                        _id: ratings.Items[i]._id.N,
                        ID_Evaluator: ratings.Items[i].id_evaluator.N,
                        ID_Evaluated: ratings.Items[i].id_evaluated.N,
                        ID_Order: ratings.Items[i].id_order.N,
                        Rating: ratings.Items[i].rating.N,
                        Description: ratings.Items[i].description.S,

                    });
                }




                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(temp);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro la reseña con ID: ' + id);
            });


        // Rating.find({ID_Evaluated: id})
        //         .then(rating => {
        //             res.status(200).send(rating);
        //         })
        //         .catch(error => {
        //             res.status(400).send('No se encontro la reseña con ID: ' + id);
        //         });
    }

}

module.exports = RatingController;