import AWS from 'aws-sdk';

type S3UploadResult = {
  file_key: string;
  file_name: string;
};

export async function uploadToS3(file: File): Promise<S3UploadResult | null> {
  try {
    AWS.config.update({
      accessKeyId: process.env.NEXT_PUBLIC_S3_ACCESS_KEY_ID,
      secretAccessKey: process.env.NEXT_PUBLIC_S3_SECRET_ACCESS_KEY,
    });

    const s3 = new AWS.S3({
      params: {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME,
      },
      region: process.env.NEXT_PUBLIC_S3_REGION,
    });

    const file_key = 'uploads/' + Date.now().toString() + file.name.replace(' ', '-');
    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET_NAME!,
      Key: file_key,
      Body: file,
    };

    const upload = s3.putObject(params).on('httpUploadProgress', (evt) => {
      console.log('Uploading to S3...', parseInt(((evt.loaded * 100) / evt.total).toString()));
    }).promise();

    await upload;

    return {
      file_key,
      file_name: file.name,
    };
  } catch (error) {
    console.log('Error uploading to S3', error);
    return null;
  }
}

export function getS3Url(file_key: string) {
  const url = `https://${process.env.NEXT_PUBLIC_S3_BUCKET_NAME}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${file_key}`
  return url
}