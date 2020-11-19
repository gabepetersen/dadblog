import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

/**
 * Big thank you to Janith Kasun for his blog on this :)
 * https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
 */

const s3 = new AWS.S3({
  accessKeyId: process.env.AWSAcessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})

/**
 * Function to Create a new instance of an S3 bucket
 * @description This might have to be called everytime before an s3 operation for some weird reason
 */
function newBucket() {
  // s3 bucket params
  const params = {
    Bucket: process.env.BlogBucket,
    CreateBucketConfiguration: {
      LocationConstraint: "us-west-2"
    }
  };
  s3.createBucket(params, function (err, data) {
    if (err) {
      console.log("Error Creating Bucket");
    } else {
      console.log("Successfully Created Bucket")
    }
  });
}

/**
 * Uploads the file at the given filePath and fileName to the s3 instance
 * @param filePath 
 * @param fileName 
 * @returns Promise resolved/rejected to boolean
 */
export function uploadFile(filePath: string, fileName: string) {
  return new Promise<boolean>((resolve, reject) => {
    // This spits out like a ton of errors but without it doesnt work???
    newBucket();

    // Read content from the file
    const fileContent = fs.readFileSync(filePath);
    // Setting the file upload parameters
    const fileParams = {
      Bucket: process.env.BlogBucket,
      Key: ('posts/' + fileName), // File name you want to save as in S3
      Body: fileContent,
      ContentType: 'text/markdown'
    };

    // Uploading files to the bucket
    s3.upload(fileParams).promise().then((data) => {
      console.log('File Successfully Uploaded to Server');
      resolve(true);
    }).catch((err) => {
      console.error(`Error With File Server Upload: ${err}`);
      reject(false)
    })
  });
}

/**
 * Reads the files into the local server posts/ directory
 * @description Obj.key equates to posts/filename.md
 * @returns Promise resolved/rejected to boolean
 */
export function readFiles() {
  return new Promise<boolean>((resolve, reject) => {
    // This spits out like a ton of errors but without it doesnt work???
    newBucket();

    const bucket = process.env.BlogBucket;
    // list all the objects
    s3.listObjects({ Bucket: bucket }).promise().then((data) => {
      var file;
      // for each of the keys in the bucket
      data.Contents.forEach((obj) => {
        // create a write stream for the posts
        file = fs.createWriteStream(path.join(process.cwd(), obj.Key));
        // get the data from storage
        s3.getObject({ Bucket: bucket, Key: obj.Key }).promise().then((result) => {
          fs.writeFileSync(path.join(process.cwd(), obj.Key), result.Body.toString());
          // error handling
        }).catch((err) => {
          console.error(`Error with Retrieving File from Server: ${err}`);
          reject(false);
        });
      })
    }).then(() => {
      console.log('Files Successfully Read from Server')
      resolve(true);
    }).catch((err) => {
      console.error(`Error with Listing Objects in File Server: ${err}`);
      reject(false);
    });
  });
}