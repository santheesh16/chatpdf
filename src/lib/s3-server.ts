import AWS from 'aws-sdk'
import fs from 'fs'

export async function downloadFromS3(file_key: string) {
    try {
        // Ensure AWS credentials are properly configured
        AWS.config.update({
            accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
            secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
        });
        // Ensure Bucket name is available
        const bucketName = process.env.NEXT_PUBLIC_S3_BUCKET_NAME;
        if (!bucketName) {
            throw new Error("S3 Bucket name is not defined in environment variables.");
        }
        const s3 = new AWS.S3({
            region: 'us-east-1', // Set your desired region
        });
        const params = {
            Bucket: bucketName,
            Key: file_key
        };
        // Fetch object from S3
        const obj = await s3.getObject(params).promise();
        const file_name = `/tmp/pdf-${Date.now()}.pdf`
        fs.writeFileSync(file_name, obj.Body as Buffer)
        return file_name; // Return the file_name after downloaded in our temp folder
    } catch (err) {
        console.error("Error downloading from S3:", err);
        return null
    }
}