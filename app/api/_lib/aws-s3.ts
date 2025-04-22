import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const S3_ACCESS_KEY_ID = process.env.S3_ACCESS_KEY_ID;
const S3_SECRET_ACCESS_KEY = process.env.S3_SECRET_ACCESS_KEY;
const S3_REGION = process.env.S3_REGION;
const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;

if (
  !S3_ACCESS_KEY_ID ||
  !S3_SECRET_ACCESS_KEY ||
  !S3_BUCKET_NAME ||
  !S3_REGION
) {
  throw new Error("Please define the S3 environment variables");
}

const s3Client = new S3Client({
  region: S3_REGION,
  credentials: {
    accessKeyId: S3_ACCESS_KEY_ID,
    secretAccessKey: S3_SECRET_ACCESS_KEY,
  },
});

async function uploadFileToS3(file, fileName) {
  const fileBuffer = file;
  const params = {
    Bucket: S3_BUCKET_NAME,
    Key: `images/products/${fileName}`,
    Body: fileBuffer,
    ContentType: "image/jpg",
  };

  const command = new PutObjectCommand(params);
  await s3Client.send(command);

  return fileName;
}

export default uploadFileToS3;
