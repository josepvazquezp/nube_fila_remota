const User = require('./../models/user');

const UsersController = {
    create: (req, res) => {
        let newUser = {
            email: req.body.email,
            password: req.body.password,
            name: req.body.name,
            type: req.body.type,
            history: [],
            status: "ok",
            image: "default icon"
        };

        User(newUser).save()
                        .then(user => {
                            res.status(201).send(user);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo crear el usuario');
                        });
    },

    update: (req, res) => {
        const id = req.params.id;
        
        if(req.body.email == undefined && req.body.type == undefined && 
           (req.body.password != undefined || req.body.name != undefined || 
            req.body.history != undefined || req.body.status != undefined || req.body.image != undefined)) {
                User.findByIdAndUpdate(id, req.body, {new:true})
                                .then(user => {
                                    res.status(200).send(user);
                                })
                                .catch(error => {
                                    res.status(400).send('No se pudo actualizar el usuario');
                                });
            }
        else {
            res.status(400).send('No se pudo actualizar el usuario');
        }
    },
    
    list: (req, res) => {
        User.find({})
                .then(users => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send(users);
                })
                .catch(error => {
                    res.status(400).send('Algo salio mal');
                });
    },
    
    search: (req, res) => {
        const id = req.params.id;
        User.findById(id).populate('history')
                .then(user => {
                    res.status(200).send(user);
                })
                .catch(error => {
                    res.status(400).send('No se encontro el usuario: ' + id);
                });
    },

    delete: (req, res) => {
        const id = req.params.id;
        User.findByIdAndDelete(id)
                                .then(user => {
                                    res.status(200).send(user);
                                })
                                .catch(error => {
                                    res.status(400).send('No se encontro el usuario: ' + id);
                                });
    }
}

module.exports = UsersController;