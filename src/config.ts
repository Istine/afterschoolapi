import { config } from "dotenv";

config({ path: "./.env.local" });

export default {
  port: process.env.PORT,
  environment: process.env.NODE_ENV,
  database_url: process.env.DATABASE_URL as string,
  salt_rounds: Number(process.env.SALT_ROUNDS),
  jwt_secret: process.env.JWT_SECRET as string,
  bucket_name: process.env.BUCKET_NAME as string,
  aws_access_key: process.env.AWS_ACCESS_KEY,
  aws_secret_key: process.env.AWS_SECRET_KEY,
};
