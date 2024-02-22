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
exports.transformCourseData = exports.transformLessonData = exports.withTransaction = exports.successResponse = exports.errorResponse = exports.decodeAccessToken = exports.createAccessToken = exports.comparePasswords = exports.encryptPassword = exports.validateData = void 0;
const yup_1 = require("yup");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("./config"));
const entity_1 = __importDefault(require("./entity"));
const LoginSchema = (0, yup_1.object)({
    email: (0, yup_1.string)().required().email(),
    password: (0, yup_1.string)()
        .required()
        .min(6, "must be at least 6 characters long")
        .max(10, "'must be at most 10 characters long'"),
});
const PaginationSchema = (0, yup_1.object)({
    page: (0, yup_1.number)().required(),
    limit: (0, yup_1.number)().required(),
});
const validateData = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const isValid = yield LoginSchema.validate(body, { strict: true });
    return isValid;
});
exports.validateData = validateData;
const encryptPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.hash(password, config_1.default.salt_rounds);
});
exports.encryptPassword = encryptPassword;
const comparePasswords = (plainPassword, hash) => __awaiter(void 0, void 0, void 0, function* () {
    return yield bcrypt_1.default.compare(plainPassword, hash);
});
exports.comparePasswords = comparePasswords;
const createAccessToken = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const token = jsonwebtoken_1.default.sign(payload, config_1.default.jwt_secret, {
        expiresIn: 60 * 60 * 24, // 24 hours
    });
    return token;
});
exports.createAccessToken = createAccessToken;
const decodeAccessToken = (token) => {
    const decoded = jsonwebtoken_1.default.verify(token, config_1.default.jwt_secret);
    return decoded;
};
exports.decodeAccessToken = decodeAccessToken;
const errorResponse = (res, code, message) => {
    res.status(code).send(message);
};
exports.errorResponse = errorResponse;
const successResponse = (res, code, message, data = {}) => {
    res.status(code).json(Object.assign({ message }, data));
};
exports.successResponse = successResponse;
const withTransaction = (callback) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield entity_1.default.sequelize.transaction((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            return yield callback(transaction);
        }
        catch (error) {
            throw error;
        }
    }));
    return result;
});
exports.withTransaction = withTransaction;
const transformLessonData = (lessons) => {
    return lessons.map((lesson) => (Object.assign(Object.assign({}, lesson), { videoUrl: "https://e-learning-app-profile-pictures-v1.s3.us-east-2.amazonaws.com/" +
            lesson.videoUrl })));
};
exports.transformLessonData = transformLessonData;
const transformCourseData = (course) => {
    return Object.assign(Object.assign({}, course), { videoTrailerUrl: "https://e-learning-app-profile-pictures-v1.s3.us-east-2.amazonaws.com/" +
            course.videoTrailerUrl, thumbnail: "https://e-learning-app-profile-pictures-v1.s3.us-east-2.amazonaws.com/" +
            course.thumbnail });
};
exports.transformCourseData = transformCourseData;
