const Product = require('./../models/product');

const ProductsController = {
    create: (req, res) => {
        let newProduct = {
            Name : req.body.Name,
            Description: req.body.Description,
            Price: req.body.Price,
            Available: true,
            Image: "default"
        };

        console.log(newProduct);

        Product(newProduct).save()
                        .then(product => {
                            res.status(201).send(product);
                        })
                        .catch(error => {
                            res.status(400).send('El producto no pudo ser registrado');
                        });
    },

    update: (req, res) => {
        const id = req.params.id;
        
        if(req.body != null) {
                Product.findByIdAndUpdate(id, req.body, {new:true})
                                .then(product => {
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
    
    list: (req, res) => {
        Product.find({})
                .then(product => {
                    res.status(200).send(product);
                })
                .catch(error => {
                    res.status(400).send('No se encontraron los productos');
                });
    },
    
    search: (req, res) => {
        const id = req.params.id;
        Product.findById(id)
                .then(product => {
                    res.status(200).send(product);
                })
                .catch(error => {
                    res.status(400).send('No se encontro al producto con ID: ' + id);
                });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Product.findByIdAndDelete(id)
                                .then(product => {
                                    res.status(200).send(product);
                                })
                                .catch(error => {
                                    res.status(400).send('No se encontro al producto con ID:' + id);
                                });
    }
}

module.exports = ProductsController;