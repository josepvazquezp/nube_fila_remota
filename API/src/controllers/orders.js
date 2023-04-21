const Order = require('./../models/order');

const OrdersController = {
    create: (req, res) => {
        let newOrder = {
            customerId: req.body.customerId,
            restaurantId: req.body.restaurantId,
            total: req.body.total,
            status: req.body.status,
            products: req.body.products,
            quantity: req.body.quantity
        };

        Order(newOrder).save()
                        .then(order => {
                            res.status(201).send(order);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo crear la orden');
                        });
    },

    update: (req, res) => {
        const id = req.params.id;

        Order.findByIdAndUpdate(id, req.body, {new:true})
                        .then(order => {
                            res.status(200).send(order);
                        })
                        .catch(error => {
                            res.status(400).send('No se pudo actualizar la orden');
                        });
    },
    
    list: (req, res) => {
        Order.find({})
                .then(orders => {
                    res.status(200).send(orders);
                })
                .catch(error => {
                    res.status(400).send('Algo salio mal');
                });
    },
    
    search: (req, res) => {
        const id = req.params.id;
        Order.findById(id)
                .then(order => {
                    res.status(200).send(order);
                })
                .catch(error => {
                    res.status(400).send('No se encontro la orden: ' + id);
                });
    },

    delete: (req, res) => {
        const id = req.params.id;
        Order.findByIdAndDelete(id)
                                .then(order => {
                                    res.status(200).send(order);
                                })
                                .catch(error => {
                                    res.status(400).send('No se encontro la orden: ' + id);
                                });
    }
}

module.exports = OrdersController;