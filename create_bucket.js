const {
    S3Client,
    CreateBucketCommand,
} = require("@aws-sdk/client-s3");
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');

const client = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://s3-openshift-storage.apps.odfcluster-uk-aug-12.devcluster.openshift.com:443',
    credentials: {
        accessKeyId: '' /* <NOOBAA_ADMIN_SECRET_HERE> */,
        secretAccessKey: '' /* <NOOBAA_ADMIN_SECRET_HERE> */,
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
