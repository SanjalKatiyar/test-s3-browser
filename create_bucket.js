const {
    S3Client,
    CreateBucketCommand,
} = require("@aws-sdk/client-s3");
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { accessKeyId, secretAccessKey, endpoint } = require('./creds');

const client = new S3Client({
    region: 'us-east-1',
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

const input = { "Bucket": "examplebucket-new-1234" };
const command = new CreateBucketCommand(input);
client.send(command).then((res) => {
    console.log("success response:");
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
