"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "./.env.local" });
exports.default = {
    port: process.env.PORT,
    environment: process.env.NODE_ENV,
    database_url: process.env.DATABASE_URL,
    salt_rounds: Number(process.env.SALT_ROUNDS),
    jwt_secret: process.env.JWT_SECRET,
    bucket_name: process.env.BUCKET_NAME,
    aws_access_key: process.env.AMZ_ACCESS_KEY,
    aws_secret_key: process.env.AMZ_SECRET_KEY,
};
