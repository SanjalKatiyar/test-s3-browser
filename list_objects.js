const { S3 } = require('@aws-sdk/client-s3');
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { accessKeyId, secretAccessKey, endpoint, region } = require('./creds');

// SDK gives a maximum of 1000 files list by default, in order to get more than that, check: https://stackoverflow.com/a/69754448, https://stackoverflow.com/a/57540786 & https://stackoverflow.com/a/18324270 
// consider using "listObjectsV2" (if needed): https://stackoverflow.com/a/37539994
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

const input = { "Bucket": "test-bucket" };
client.listObjects(input).then((res) => {
    console.log("success response:");
    console.log(res.IsTruncated);
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    console.log(err.$response);
});
