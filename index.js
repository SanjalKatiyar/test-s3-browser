const {
    S3Client,
    CreateBucketCommand,
    ListBucketsCommand,
} = require("@aws-sdk/client-s3");
const https = require('https');
const { NodeHttpHandler } = require('@aws-sdk/node-http-handler');
const { readFileSync } = require('fs');

// https://ae17bf3c2c0c742e39a1ce261d29954c-1806269466.us-east-1.elb.amazonaws.com (load balancer serivce) ----> (WORKS WITH TLS DISABLED)
// https://ae17bf3c2c0c742e39a1ce261d29954c-1806269466.us-east-1.elb.amazonaws.com:443 (load balancer serivce for https port) ----> (WORKS WITH TLS DISABLED)
// https://ae17bf3c2c0c742e39a1ce261d29954c-1806269466.us-east-1.elb.amazonaws.com:80 (load balancer serivce for http port)
// https://console-openshift-console.apps.drcluster2-aug-9-24.devcluster.openshift.com/api/proxy/plugin/odf-console/test-noobaa (plugin proxy for port 443)
// https://s3-openshift-storage.apps.drcluster2-aug-9-24.devcluster.openshift.com (default https route for port 443) ----> (WORKS WITH TLS DISABLED)
// http://s3-test-openshift-storage.apps.drcluster2-aug-9-24.devcluster.openshift.com (custom http route for port 80)
// http://127.0.0.1:9000 ("kubectl port-forward service/s3 -n openshift-storage 9000:80") (http port) ----> (WORKS FOR LOCAL, WITHOUT DISABLING TLS)
// http://127.0.0.1:8000 ("kubectl port-forward service/s3 -n openshift-storage 8000:443") (https port)

// 'https://a2efcedcfee1d4e1995ea82930a9762f-1785970140.us-east-1.elb.amazonaws.com:443', // 'https://s3-openshift-storage.apps.odfcluster-uk-aug-12.devcluster.openshift.com:443', // 'http://127.0.0.1:9000', // http://s3-http-openshift-storage.apps.odfcluster-uk-aug-12.devcluster.openshift.com:80

const certs = [readFileSync("ca-bundle.crt")];
const agent = new https.Agent({
   rejectUnauthorized: true,
   ca: certs,
});

const client = new S3Client({
    region: 'us-east-1',
    endpoint: 'https://s3-openshift-storage.apps.odfcluster-uk-aug-12.devcluster.openshift.com:443', // 'http://s3-http-openshift-storage.apps.odfcluster-uk-aug-12.devcluster.openshift.com',
    credentials: {
        accessKeyId: '' /* <NOOBAA_ADMIN_SECRET_HERE> */,
        secretAccessKey: '' /* <NOOBAA_ADMIN_SECRET_HERE> */,
    },
    s3ForcePathStyle: true,
    requestHandler: new NodeHttpHandler({
        httpAgent: agent,
        httpsAgent: agent
    }),
    // requestHandler: new NodeHttpHandler({
    //     httpsAgent: new https.Agent({
    //       rejectUnauthorized: false,
    //     }),
    // }),
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
