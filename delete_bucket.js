const { S3 } = require('@aws-sdk/client-s3');
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

const input = { "Bucket": "test-bucket-new" };
client.deleteBucket(input).then((res) => {
    console.log("success response:");
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
