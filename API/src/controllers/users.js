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

        console.log(newUser);

        User(newUser).save()
                        .then(user => {
                            

                            res.status(201).send(user);
                        })
                        .catch(error => {
                            res.setHeader('Access-Control-Allow-Origin', '*');
                            res.status(400).send('No se pudo crear el usuario');
                        });
    },

    update: (req, res) => {
        const id = req.params.id;
        
        if(req.body.email == undefined && req.body.type == undefined && 
           (req.body.password != undefined || req.body.name != undefined || 
            req.body.history != undefined || req.body.status != undefined || req.body.image != undefined)) {
                console.log("Listo para modificar");

                User.findByIdAndUpdate(id, req.body, {new:true})
                                .then(user => {
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    res.status(200).send(user);
                                })
                                .catch(error => {
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    res.status(400).send('No se pudo actualizar el usuario');
                                });
            }
        else {
            res.setHeader('Access-Control-Allow-Origin', '*');
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
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('Algo salio mal');
                });
    },
    
    search: (req, res) => {
        const id = req.params.id;
        User.findById(id).populate('history')
                .then(user => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send(user);
                })
                .catch(error => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('No se encontro el usuario: ' + id);
                });
    },

    delete: (req, res) => {
        const id = req.params.id;
        User.findByIdAndDelete(id)
                                .then(user => {
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    res.status(200).send(user);
                                })
                                .catch(error => {
                                    res.setHeader('Access-Control-Allow-Origin', '*');
                                    res.status(400).send('No se encontro el usuario: ' + id);
                                });
    },
    searchCreate: (req, res) => { //Esta ruta se encarga de verificar si ya existe el email con el que se creara un nuevo usuario
        const Qemail = req.params.email;
        console.log("Buscando con email: " + Qemail)


        User.find({email: Qemail})
                .then(user => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send(user);
                })
                .catch(error => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('No se encontro el usuario: ' + id);
                });
    },
    searchLogin: (req, res) => { //Esta ruta se encarga de verificar si el email y contraseña son correctos
        let loginCheck = {
            Lemail: req.body.email,
            Lpassword: req.body.password
        };


        User.find({email: loginCheck.Lemail, password: loginCheck.Lpassword})
                .then(user => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(200).send(user);
                })
                .catch(error => {
                    res.setHeader('Access-Control-Allow-Origin', '*');
                    res.status(400).send('No se encontro el usuario: ' + id);
                });
    }
}

module.exports = UsersController;