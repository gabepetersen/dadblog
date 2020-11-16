import AWS from 'aws-sdk';
import fs from 'fs';

/**
 * Big thank you to Janith Kasun for this :)
 * https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
 */

const s3 = new AWS.S3({
  accessKeyId: process.env.AWSAcessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})

export function createBucket() {
  const params = {
    Bucket: process.env.BlogBucket,
    CreateBucketConfiguration: {
      // Set your region here
      LocationConstraint: "us-west-2"
    }
  };

  s3.createBucket(params, function(err, data) {
    if (err) console.log(err, err.stack);
    else console.log('Bucket Created Successfully', data.Location);
  });
}

export function uploadFile(filePath: string, fileName: string) {
  // Read content from the file
  const fileContent = fs.readFileSync(filePath);

  // Setting up S3 upload parameters
  const params = {
    Bucket: process.env.BlogBucket,
    Key: ('posts/' + fileName), // File name you want to save as in S3
    Body: fileContent
  };

  // Uploading files to the bucket
  s3.upload(params, function(err, data) {
    if (err) {
      console.error(err)
      throw err;   
    }
    console.log(`File uploaded successfully. ${data.Location}`);
  });
}