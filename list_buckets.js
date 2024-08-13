const {
    S3Client,
    ListBucketsCommand,
} = require("@aws-sdk/client-s3");
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { accessKeyId, secretAccessKey, endpoint, region } = require('./creds');

const client = new S3Client({
    region: region,
    endpoint: endpoint,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    s3ForcePathStyle: true,
    requestHandler: new NodeHttpHandler({
        httpsAgent: new https.Agent({
          rejectUnauthorized: false,
        }),
    }),
    // sslEnabled: false,
});

// use "S3" format instead of "S3Client" (check other files)
const input = {};
const command = new ListBucketsCommand(input);
client.send(command).then((res) => {
    console.log("success response:");
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
