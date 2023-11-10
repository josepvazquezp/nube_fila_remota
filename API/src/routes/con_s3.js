const { S3Client } = require("@aws-sdk/client-s3");
require('dotenv').config();

const s3 = new S3Client({                   // como crear cuenta
    region: "us-east-1",
    credentials: {
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        sessionToken: process.env.SESSION_TOKEN
    }
});

module.exports = s3;