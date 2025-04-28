import AWS from "aws-sdk"; // AWS SDK for interacting with AWS services
import fs from "fs"; // File system module for file operations
import path from "path"; // Path module for handling file paths

/**
 * Downloads a file from AWS S3 to the local filesystem
 * 
 * This server-side function retrieves a file from S3 storage and saves it
 * to a temporary directory in the project, making it accessible for processing.
 * 
 * @param file_key - The unique key (path) of the file in the S3 bucket
 * @returns The local file path where the downloaded file is saved, or null if download fails
 */
export async function downloadFromS3(file_key: string) {
  try {
    // Configure AWS SDK with credentials from environment variables
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_KEY,
    });


    // Initialize S3 client with bucket configuration
    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: "us-east-2", // AWS region where the bucket is located
    });


    // Set up parameters for the getObject operation
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, // The S3 bucket name
      Key: file_key, // The specific file to download
    };


    // Retrieve the file from S3
    const obj = await s3.getObject(params).promise();


    // Create a temporary directory if it doesn't exist
    // This ensures we have a place to store downloaded files
    const tmpDir = path.join(process.cwd(), "tmp");
    if (!fs.existsSync(tmpDir)) {
      fs.mkdirSync(tmpDir);
    }


    // Generate a unique filename with timestamp to avoid collisions
    const file_name = path.join(tmpDir, `pdf-${Date.now()}.pdf`);
    

    // Write the file content to the local filesystem
    fs.writeFileSync(file_name, obj.Body as Buffer);


    // Return the local file path for further processing
    return file_name;
    
  } catch (error) {
    // Log any errors that occur during the download process
    console.error("Error downloading from S3:", error);

    // Return null to indicate failure
    return null; 
  }
}
