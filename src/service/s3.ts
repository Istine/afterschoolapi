import AWS from "aws-sdk";
import config from "../config";
import path from "path";

AWS.config.update({
  accessKeyId: config.aws_access_key,
  secretAccessKey: config.aws_secret_key,
  region: "us-east-2", // Replace with your desired AWS region
  signatureVersion: "v4",
});

const s3 = new AWS.S3();

const mediaConvert = new AWS.MediaConvert();

export const uploadToBucket = async (
  bucketName: string,
  key: string,
  file: any
) => {
  const params = {
    Bucket: bucketName,
    Key: key,
    Body: file,
  };

  return await s3.upload(params).promise();
};

export const deleteFromBucket = async (bucketName: string, key: string) => {
  const params = {
    Bucket: bucketName,
    Key: key,
  };

  return await s3.deleteObject(params).promise();
};

export const getSignedUrl = (params: {
  Key: string;
  Bucket: string;
  ContentType: string;
  Expires: number;
}) => {
  return s3.getSignedUrl("putObject", params);
};
