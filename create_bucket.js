/*const {
    S3Client,
    CreateBucketCommand,
} = require("@aws-sdk/client-s3");*/
const { S3 } = require('@aws-sdk/client-s3');
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { accessKeyId, secretAccessKey, endpoint, region } = require('./creds');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#createBucket-property

/*
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

const input = { "Bucket": "test-1" };
const command = new CreateBucketCommand(input);
client.send(command).then((res) => {
    console.log("success response:");
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
*/

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

const input = { "Bucket": "test-1" };
client.createBucket(input).then((res) => {
    console.log("success response:");
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
