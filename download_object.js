const { S3 } = require('@aws-sdk/client-s3');
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { accessKeyId, secretAccessKey, endpoint, region } = require('./creds');

// https://docs.aws.amazon.com/AWSJavaScriptSDK/latest/AWS/S3.html#getObject-property

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
client.getObject(input).then((res) => {
    console.log("success response:");
    console.log(res.Body);
    res.Body.transformToString().then((file) => console.log(file)).catch((err) => console.log(err));
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
