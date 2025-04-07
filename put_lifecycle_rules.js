process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const {
    S3Client,
    PutBucketLifecycleConfigurationCommand,
} = require("@aws-sdk/client-s3");
const { accessKeyId, secretAccessKey, endpoint, region } = require('./creds');

const client = new S3Client({
    region: region,
    endpoint: endpoint,
    credentials: {
        accessKeyId: accessKeyId,
        secretAccessKey: secretAccessKey,
    },
    s3ForcePathStyle: true,
});

const input = {
    Bucket: "test",
    LifecycleConfiguration: {
        Rules: [
            {
              "ID": "Test",
              "Status": "Enabled",
              "Filter": {},
              "AbortIncompleteMultipartUpload": {
                "DaysAfterInitiation": 5
              }
            }
        ]
    }
};
const command = new PutBucketLifecycleConfigurationCommand(input);
client.send(command).then((res) => {
    console.log("success response:");
    console.log(res);
}).catch((err) => {
    console.log("error response:");
    console.log(err);
    if (err.$response) {
        console.log("Raw HTTP Response:");
        console.log(err.$response.body);
    }
});
