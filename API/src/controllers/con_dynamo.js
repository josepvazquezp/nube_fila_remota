const { DynamoDBClient } = require("@aws-sdk/client-dynamodb")
require('dotenv').config();

const dbc = new DynamoDBClient({                   // como crear cuenta
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        sessionToken: process.env.SESSION_TOKEN
    }
});

module.exports = dbc;