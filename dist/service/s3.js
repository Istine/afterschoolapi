"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedUrl = exports.deleteFromBucket = exports.uploadToBucket = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const config_1 = __importDefault(require("../config"));
aws_sdk_1.default.config.update({
    accessKeyId: config_1.default.aws_access_key,
    secretAccessKey: config_1.default.aws_secret_key,
    region: "us-east-2",
    signatureVersion: "v4",
});
const s3 = new aws_sdk_1.default.S3();
const mediaConvert = new aws_sdk_1.default.MediaConvert();
const uploadToBucket = (bucketName, key, file) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: key,
        Body: file,
    };
    return yield s3.upload(params).promise();
});
exports.uploadToBucket = uploadToBucket;
const deleteFromBucket = (bucketName, key) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        Bucket: bucketName,
        Key: key,
    };
    return yield s3.deleteObject(params).promise();
});
exports.deleteFromBucket = deleteFromBucket;
const getSignedUrl = (params) => {
    return s3.getSignedUrl("putObject", params);
};
exports.getSignedUrl = getSignedUrl;
