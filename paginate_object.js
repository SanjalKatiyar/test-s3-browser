const { S3 } = require('@aws-sdk/client-s3');
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { accessKeyId, secretAccessKey, endpoint, region } = require('./creds');

// SDK gives a maximum of 1000 files list by default, in order to get more than that, check: https://stackoverflow.com/a/69754448
// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#listObjects-property

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

const input1 = {
    "Bucket": "test-bucket",
    "MaxKeys": 1,
};
const input2 = {
    "Bucket": "test-bucket",
    "MaxKeys": 1,
    "Marker": 'hello-s3.txt'
};
const input3 = {
    "Bucket": "test-bucket",
    "MaxKeys": 1,
    "Marker": 'test-123.txt'
};
client.listObjects(input3).then((res) => {
    console.log("success response:");
    console.log(res.IsTruncated);
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
