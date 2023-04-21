const Chat = require('./../models/chat');

const ChatsController = {
    create: (req, res) => {
        let newChat = {
            customerId: req.body.customerId,
            restaurantId: req.body.restaurantId,
            messages: []
        };

        Chat(newChat).save()
                        .then(chat => {
                            res.status(201).send(chat);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo crear el chat');
                        });
    },

    update: (req, res) => {
        const id = req.params.id;

        const newMessage = {
            sender: req.body.sender,
            message: req.body.message
        }

        console.log("ID: " + id);
        console.log("Cuerpo: " + newMessage)


        Chat.findByIdAndUpdate(id, {$push: {messages: newMessage}},  { new: true })
                        .then(chat => {
                            res.status(200).send(chat);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo actualizar el chat');
                        });
    },
    
    list: (req, res) => {
        Chat.find({})
                .then(chat => {
                    res.status(200).send(chat);
                })
                .catch(error => {
                    res.status(400).send('Algo salio mal');
                });
    },
    
    search: (req, res) => {
        const id = req.params.id;
        Chat.findById(id)
                .then(chat => {
                    res.status(200).send(chat);
                })
                .catch(error => {
                    res.status(400).send('No se encontro el chat: ' + id);
                });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Chat.findByIdAndDelete(id)
                                .then(chat => {
                                    res.status(200).send(chat);
                                })
                                .catch(error => {
                                    res.status(400).send('No se encontro el chat: ' + id);
                                });
    },
    findMyChat: (req, res) => {
        const MyID = req.body.MyID
        const ItID = req.body.ItID;
        console.log(req.body);

        Chat.find({customerId: MyID, restaurantId: ItID})
                .then(chat => {
                    console.log("Chat encontrado")
                    console.log(chat);
                    res.status(200).send(chat);
                })
                .catch(error => {
                    res.status(400).send('No se encontro el chat: ');
                });
    }
}

module.exports = ChatsController;