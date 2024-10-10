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

const input = { "Bucket": "test-1", "MaxKeys": 1000, "Delimiter": "", "Prefix": "" };
client.listObjects(input).then((res) => {
    console.log("success response - list objects:");
    console.log(res);
    console.log(res.Contents.length);

    const params = {
        Bucket: "test-1", 
        Delete: {
         Objects: res.Contents.map((obj) => ({ Key: obj.Key })), 
         Quiet: false
        }
    };
    client.deleteObjects(params).then((res) => {
        console.log("success response - delete objects:");
        console.log(res);
    }).catch((err) => {
        console.log("error response - delete objects:");
        console.log(err);
        console.log(err.$response);
    });
}).catch((err) => {
    console.log("error response - list objects:");
    console.log(err);
    console.log(err.$response);
});
