import AWS from 'aws-sdk';
import fs from 'fs';
import path from 'path';

/**
 * Big thank you to Janith Kasun for this :)
 * https://stackabuse.com/uploading-files-to-aws-s3-with-node-js/
 */

const s3 = new AWS.S3({
  accessKeyId: process.env.AWSAcessKeyId,
  secretAccessKey: process.env.AWSSecretKey
})

function newBucket() {
  // s3 bucket params
  const params = {
    Bucket: process.env.BlogBucket,
    CreateBucketConfiguration: {
      LocationConstraint: "us-west-2"
    }
  };
  s3.createBucket(params, function(err, data) {
    if (err) {     
      return err;
    } else {
      return data;
    }
  }); 
}

export function uploadFile(filePath: string, fileName: string) {
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
  s3.upload(fileParams, function(err, data) {
    if (err) {
      console.error("Error with upload: ", err); 
    } else {
      console.log(`File uploaded successfully. ${data.Location}`);
    }
  });
}


export function readFiles() {
  // This spits out like a ton of errors but without it doesnt work???
  newBucket();

  const params = {
    Bucket: process.env.BlogBucket
  }
  var fileParams = {
    Bucket: process.env.BlogBucket,
    Key: ''
  }
  s3.listObjects(params, function(err, data) {
    if (err) {
      console.log("Error with List Objects", err);
      return 0;
    }
    var file;
    // for each of the keys
    data.Contents.forEach((obj) => {
      fileParams.Key = obj.Key;
      // create a write stream for the posts
      file = fs.createWriteStream(path.join(process.cwd(), obj.Key));
      // get the data from storage
      s3.getObject(fileParams).createReadStream().pipe(file).on('error', function(err) {
        // capture any errors that occur when writing data to the file
        console.error('File Stream:', err);
      }).on('close', function() {
          console.log('Done.');
      });
    })
  });
}