import AWS from "aws-sdk";

/**
 * Uploads a file to AWS S3 storage
 * 
 * This client-side function handles uploading files (typically PDFs) to S3 storage,
 * tracking upload progress, and returning metadata about the uploaded file.
 * 
 * @param file - The file object to upload (from a file input or drag-and-drop)
 * @returns Promise resolving to an object with file_key and file_name, or undefined on error
 */
export async function uploadToS3(file: File) {
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


    // Generate a unique file key (path) for the uploaded file
    // Format: uploads/timestamp-filename with spaces replaced by hyphens
    const file_key =
      "uploads/" + Date.now().toString() + file.name.replace(" ", "-");


    // Set up parameters for the putObject operation
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!, // The S3 bucket name
      Key: file_key, // The generated unique file key
      Body: file, // The actual file content
    };


    // Initiate the upload with progress tracking
    const upload = s3
      .putObject(params)
      .on("httpUploadProgress", (evt) => {
        // Calculate and log upload progress percentage
        console.log(
          "uploading to s3...",
          parseInt(((evt.loaded * 100) / evt.total).toString())
        ) + "%";
      })
      .promise();


    // Wait for the upload to complete
    await upload.then((data) => {
      console.log("successfully uploaded to S3!", file_key);
    });


    // Return metadata about the uploaded file
    return Promise.resolve({
      file_key, // The unique S3 key (path) where the file is stored
      file_name: file.name, // The original filename
    });
  } catch (error) {

  }
}


/**
 * Generates a public URL for accessing a file in S3
 * 
 * @param file_key - The S3 key (path) of the file
 * @returns The complete URL to access the file
 */
export function getS3Url(file_key: string) {
  // Construct the URL using the S3 bucket name and file key
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.us-east-2.amazonaws.com/${file_key}`;
  return url;
}
