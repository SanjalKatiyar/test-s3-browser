const { S3, GetObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { accessKeyId, secretAccessKey, endpoint, region } = require('./creds');

const client = new S3({
    region: region,
    endpoint: endpoint,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
    }),
    forcePathStyle: true,
    // sslEnabled: false,
});

const input = { 
    Bucket: "test-bucket",
    Key: "test-123.txt",
};
const command = new GetObjectCommand(input);
getSignedUrl(client, command, { expiresIn: 3600 }).then((res) => {
    console.log("success response:");
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
