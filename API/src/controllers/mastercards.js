const Card = require('./../models/mastercard');

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const { PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand, DynamoDB } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');

require('dotenv').config();


const CardController = {
    create: async function create_card(req, res) {
        let newCard = {
            ID_User : req.body.ID_User,
            Type: req.body.Type,
            Date: req.body.Date,
            Number: req.body.Number
        };

        let getIdCount = new GetItemCommand({
            TableName: "Cards",
            Key: {
                _id: {
                    "N": "0"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);
        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let insertValue = new PutItemCommand({
            TableName: 'Cards',
            Item: {
                _id: {
                    N: newId.toString()
                },
                id_user: { N: req.body.ID_User },
                type: { S: req.body.Type },
                date: { S: req.body.Date },
                number: { S: req.body.Number },
            }
        });

        let idUpdate = new UpdateItemCommand({
            TableName: 'Cards',
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

        await conDBC.send(insertValue).then(card => {
            res.status(201).send(card.Items);
        })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se pudo registrar la tarjeta');
            });

    },
    //================================================================================= 
    update: async function update_card(req, res){
        const id = req.params.id;



        card_updated = new UpdateItemCommand({
            TableName: 'Cards',
            "ExpressionAttributeNames": {
                "#TYP": "type",
                "#NUM": "number",
                "#DAT": "date"
              },
            ExpressionAttributeValues: {
                ":ty": {
                    "S": req.body.Type
                },
                ":no": {
                    "S": req.body.Number
                },
                ":da": {
                    "S": req.body.Date
                }
            },
            Key: {
                _id: {
                    "N": id
                }
            },
            UpdateExpression: "SET #TYP = :ty, #NUM = :no, #DAT = :da",
            ReturnValues: "ALL_NEW"
        });

        await conDBC.send(card_updated)
                .then(resCard => {
                    console.log("Cambiada")
                    console.log(resCard)

                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send(resCard);
                })
                .catch(error => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('No se pudo actualizar la tarjeta');
                });

    },
    //=================================================================================
    list: async function list_cards(req, res) {
        let input = {
            TableName: "Cards"
        };


        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(cards => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(cards.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('Algo salio mal');
            });
    },
    //=====================================================
    search: async function search_card(req, res) {
        const id = req.params.id;

        console.log("Buscando");

        let input = {
            TableName: "Cards",
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
            .then(cards => {


                let temp = {
                    _id : cards.Items[0]._id.N,
                    ID_user : cards.Items[0].id_user.N,
                    Type: cards.Items[0].type.S,
                    Date: cards.Items[0].date.S,
                    Number : cards.Items[0].number.S,
                }



                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(temp);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro la tarjeta con ID: ' + id);
            });
    },
    //==================================================================
    delete: async function  delete_card(req, res) {
        const id = req.params.id;

        let input = {
            Key: {
                "_id": {
                    "N": id
                }
            },
            TableName: "Cards"
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

    },
    //==================================================================
    searchCreate:async function  search_create(req, res) { 
        const Qnumber = req.params.number;


        let input = {
            TableName: "Cards",
            "ExpressionAttributeNames": {
                "#NOM": "number"
              },
              "ExpressionAttributeValues": {
                ":nom": {
                  "S": Qnumber
                }
              },
              "FilterExpression": "#NOM = :nom",
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(card => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(card.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro la tarjeta');
            });


    },
    listUserCards: async function (req, res){
        const Quser = req.params.user;

        let input = {
            TableName: "Cards",
            "ExpressionAttributeNames": {
                "#USR": "id_user"
              },
              "ExpressionAttributeValues": {
                ":use": {
                  "N": Quser
                }
              },
              "FilterExpression": "#USR = :use",
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(cards => {


                let temp = [];


                for( i = 0; i< cards.Count; i ++){
                    temp.push({_id : cards.Items[i]._id.N,
                        ID_user : cards.Items[i].id_user.N,
                        Type: cards.Items[i].type.S,
                        Date: cards.Items[i].date.S,
                        Number : cards.Items[i].number.S,})
                }


                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(temp);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontraron tarjetas');
            });
    }
    
}

module.exports = CardController;