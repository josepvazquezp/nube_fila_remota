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

        Chat.findByIdAndUpdate(id, req.body, {new:true})
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
    }
}

module.exports = ChatsController;