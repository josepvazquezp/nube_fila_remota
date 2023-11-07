const Chat = require('./../models/chat');

const jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

const { PutItemCommand, GetItemCommand, UpdateItemCommand, ScanCommand, DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const conDBC = require('./con_dynamo');


const ChatsController = {
    create: async function create_chat (req, res) {
        let newChat = {
            customerId: req.body.customerId,
            restaurantId: req.body.restaurantId,
            messages: []
        };

        let getIdCount = new GetItemCommand({
            TableName: "Chats",
            Key: {
                _id: {
                    "N": "0"
                }
            },
        });

        let resIdCount = await conDBC.send(getIdCount);
        let newId = parseInt(resIdCount.Item.IdCount.N) + 1;

        let idUpdate = new UpdateItemCommand({
            TableName: 'Chats',
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

        let insertValue = new PutItemCommand({
            TableName: 'Chats',
            Item: {
                _id: {
                    N: newId.toString()
                },
                customer_id: { N: req.body.customerId },
                restaurant_id: { N: req.body.restaurantId },
                L: data.messages.map(message => ({
                    M: {
                      sender: { S: message.sender },
                      message: { S: message.message },
                      date: { S: message.date }
                    }
                  }))
            }
        });


        await conDBC.send(insertValue).then(chat => {
            res.status(201).send(chat);
        })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se pudo crear el chat');
            });

        // Chat(newChat).save()
        //                 .then(chat => {
        //                     res.status(201).send(chat);
        //                 })
        //                 .catch(error => {
        //                     res.status(400).send('No se pudo crear el chat');
        //                 });
    },
    //==============================================================================
    //==============================================================================
    update: async function update_chat (req, res)  {
        const id = req.params.id;

        let ts = Date.now()
        let date = new Date(ts);
        let stringDate = date.getHours()  + ":" + date.getMinutes() + " " + date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()


        const newMessage = {
            sender: req.body.sender,
            message: req.body.message,
            date: stringDate
        }

        console.log("Creando Chat");


        chat_updated = new UpdateItemCommand({
            TableName: 'Chats',

            ExpressionAttributeValues: {
                ":msgn": {
                    L: [{ M: {
                        sender: { S: newMessage.sender },
                        message: { S: newMessage.message },
                        date: { S: newMessage.date}
            },}]},},
            Key: {
                _id: {
                    "N": id
                }
            },
            UpdateExpression: "SET messages = list_append(messages, :msgn)",
            ReturnValues: "ALL_NEW"
        });

        await conDBC.send(card_updated).then(reschat => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(200).send(reschat);
        })
        .catch(error => {
            res.setHeader('Access-Control-Allow-Origin', '*');
            res.status(400).send('No se pudo actualizar el chat');
        });


        // Chat.findByIdAndUpdate(id, {$push: {messages: newMessage}},  { new: true })
        //                 .then(chat => {
        //                     res.status(200).send(chat);
        //                 })
        //                 .catch(error => {
        //                     res.status(400).send('No se pudo actualizar el chat');
        //                 });

    },
    //==============================================================================
    //==============================================================================
    
    list: async function list_chats(req, res) {

        let input = {
            TableName: "Chats"
        };


        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(chats => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(chats.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('Algo salio mal');
            });


        // Chat.find({})
        //         .then(chat => {
        //             res.status(200).send(chat);
        //         })
        //         .catch(error => {
        //             res.status(400).send('Algo salio mal');
        //         });
    },
    //==============================================================================
    //==============================================================================
    //No se utiliza esto, pues si bien tiene ID en Mongo, en AWS no sirve de nada
    search: async function search_chat (req, res){
        const id = req.params.id;


        let input = {
            TableName: "Chats",
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
            .then(chat => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(chat);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el chat con ID: ' + id);
            });


        // Chat.findById(id)
        //         .then(chat => {
        //             res.status(200).send(chat);
        //         })
        //         .catch(error => {
        //             res.status(400).send('No se encontro el chat: ' + id);
        //         });
    },
    //==============================================================================
    //==============================================================================
    //Lo mismo con delete, si no se tiene un ID fijo para cada chat, de poco sirve, pero no se invoca
    delete: async function delete_chat (req, res){
        const id = req.params.id;

        let input = {
            Key: {
                "_id": {
                    "N": id
                }
            },
            TableName: "Chats"
        };

        let command = new DeleteItemCommand(input);
        await conDBC.send(command)
            .then(chat => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(chat);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el chat con ID:' + id);
            });

        



        // Chat.findByIdAndDelete(id)
        //                         .then(chat => {
        //                             res.status(200).send(chat);
        //                         })
        //                         .catch(error => {
        //                             res.status(400).send('No se encontro el chat: ' + id);
        //                         });
    },
    //==============================================================================
    //==============================================================================
    findAllMine: async function find_all_mine(req, res) {
        const MyID = req.body.MyID
        const type  = (req.body.type == "Cliente") ? "customerId" : "restaurantId";
        //let body = JSON.parse('{"' + type + '": "' + MyID + '"}');


        let input;

        if(req.body.type == "Cliente"){
            input = {
                TableName: "Chats",
                "ExpressionAttributeNames": {
                    "#CID": "customer_id"
                  },
                  "ExpressionAttributeValues": {
                    ":cidq": {
                      "N": MyID
                    }
                  },
                  "FilterExpression": "#CID = :cidq",
            };
        }else{
            input = {
                TableName: "Chats",
                "ExpressionAttributeNames": {
                    "#CID": "restaurant_id"
                  },
                  "ExpressionAttributeValues": {
                    ":cidq": {
                      "N": MyID
                    }
                  },
                  "FilterExpression": "#CID = :cidq",
            };
        }


        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(chat => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(chat);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontraron chats ');
            });

        // Chat.find(body)
        //         .then(chat => {
        //             res.status(200).send(chat);
        //         })
        //         .catch(error => {
        //             res.status(400).send('No se encontro el chat: ');
        //         });
    },
    //==============================================================================
    //==============================================================================
    findChat: async function  find_chat(req, res){
        const MyID = req.body.MyID
        const ItID = req.body.ItID;

        body = JSON.parse('{"customerId": "' + MyID + '", "restaurantId": "' + ItID +'"}')
        console.log(body);

        let input = {
            TableName: "Chats",
            "ExpressionAttributeNames": {
                "#CID": "customer_id",
                "#RID": "restaurant_id",

              },
              "ExpressionAttributeValues": {
                ":cidq": {
                  "N": MyID
                },
                ":ridq": {
                    "N": ItID
                  }
              },
              "FilterExpression": "#CID = :cidq, #RID = :ridq",
        };

        let command = new ScanCommand(input);
        await conDBC.send(command)
            .then(chat => {

                console.log(chat);

                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(200).send(chat.Items);
            })
            .catch(error => {
                res.setHeader('Access-Control-Allow-Origin', '*');
                res.status(400).send('No se encontro el chat: desde boton');
            });


        // Chat.find(body)
        //         .then(chat => {

        //             res.status(200).send(chat);
        //         })
        //         .catch(error => {
        //             res.status(400).send('No se encontro el chat: ');
        //         });
    }
}

module.exports = ChatsController;