const Restaurant = require('./../models/restaurant');

const RestaurantsController = {
    create: (req, res) => {
        let newRestaurant = {
            name: req.body.name,
            products: [],
            description: req.body.description,
            type: req.body.type,
            location: req.body.location,
            image: "default icon"
        };

        Restaurant(newRestaurant).save()
                        .then(restaurant => {
                            res.status(201).send(restaurant);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo crear el restaurant');
                        });
    },

    update: (req, res) => {
        const id = req.params.id;
        
        Restaurant.findByIdAndUpdate(id, req.body, {new:true})
                        .then(restaurant => {
                            res.status(200).send(restaurant);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo actualizar el restaurant');
                        });
    },
    
    list: (req, res) => {
        Restaurant.find({})
                .then(restaurants => {
                    res.status(200).send(restaurants);
                })
                .catch(error => {
                    res.status(400).send('Algo salio mal');
                });
    },
    
    search: (req, res) => {
        const id = req.params.id;
        Restaurant.findById(id)
                .then(restaurants => {
                    res.status(200).send(restaurants);
                })
                .catch(error => {
                    res.status(400).send('No se encontro el restaurant: ' + id);
                });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Restaurant.findByIdAndDelete(id)
                                .then(restaurant => {
                                    res.status(200).send(restaurant);
                                })
                                .catch(error => {
                                    res.status(400).send('No se encontro el restaurant: ' + id);
                                });
    }
}

module.exports = RestaurantsController;