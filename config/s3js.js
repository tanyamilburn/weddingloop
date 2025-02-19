const AWS = require('aws-sdk');
require('dotenv').config();
const crypto = require('crypto');
const { promisify } = require('util');
const randomBytes = promisify(crypto.randomBytes);

const region = process.env.AWS_REGION;
const bucket = process.env.AWS_BUCKET;
const accessKeyId = process.env.AWS_ACCESS_KEY;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
const s3 = new AWS.S3({
  region,
  accessKeyId,
  secretAccessKey,
  signatureVersion: 'v4'
});
async function generateUploadURL() {
  let rawBytes = await randomBytes(16);
  let imageName = rawBytes.toString('hex');

  let params = ({
    Bucket: bucket,
    Key: imageName,
    Expires: 60
  });

  let uploadURL = await s3.getSignedUrlPromise('putObject', params);
  return uploadURL;
};

module.exports = {
  s3: s3,
  generateUploadURL: generateUploadURL
};