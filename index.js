const express = require('express');
const mongoose = require('mongoose'); 
const routes = require('./routes');
const extraRoutes = require('./src/routes/index');
const swaggerJsDoc= require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');
const swaggerConf = require('./swagger.config');

require('dotenv').config();

const app = express();

const mongoUrl = process.env.MONGO_URL;

console.log(mongoUrl);

const port = process.env.PORT || 3000;

const swaggerDocs = swaggerJsDoc(swaggerConf);

app.use('/swagger', swaggerUI.serve, swaggerUI.setup(swaggerDocs));

app.use('/', extraRoutes);
routes(app);

mongoose.connect(mongoUrl).then(() =>{
    console.log('Se conecto correctamente a la base de datos');
    app.listen(port, function() {
        console.log('app is running in port ' + port);
    });   
}).catch(err => {
    console.log('No se pudo conectar a la base de datos', err);
});