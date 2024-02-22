"use strict";
"use client";
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
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const course_1 = require("../service/course");
const http_status_codes_1 = require("http-status-codes");
const lib_1 = require("../lib");
const config_1 = __importDefault(require("../config"));
const s3_1 = require("../service/s3");
exports.default = (app) => {
    const router = express_1.default.Router();
    app.use("/api/course", router);
    router.get("/signed-url", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { filename, contentType, type } = req.query;
        const folder = type === "video" ? "trailers" : "images";
        const key = `${folder}/${filename}`;
        const params = {
            Bucket: config_1.default.bucket_name,
            Key: key,
            ContentType: contentType,
            Expires: 60 * 50,
        };
        const signedUrl = (0, s3_1.getSignedUrl)(params);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            signedUrl,
            key,
        });
    })));
    router.post("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const course = yield (0, course_1.createCourse)(req.body);
        if (!course)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.CREATED, http_status_codes_1.ReasonPhrases.CREATED);
    })));
    router.get("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const courses = yield (0, course_1.getCourses)();
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            courses,
        });
    })));
    router.get("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const course = yield (0, course_1.getCourseById)(req.params.id);
        if (!course)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            course,
        });
    })));
    router.put("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const existingCourse = yield (0, course_1.getCourseById)(req.body.id);
        const updatedCourse = yield (0, course_1.updateCourseById)(req.body.id, req.body);
        if (!updatedCourse[0])
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
        if (existingCourse &&
            existingCourse.videoTrailerUrl !== req.body.videoTrailerUrl) {
            const name = existingCourse.videoTrailerUrl.split("/")[existingCourse.videoTrailerUrl.split("/").length - 1];
            const key = `trailers/${name}`;
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, s3_1.deleteFromBucket)(config_1.default.bucket_name, key);
            }), 0);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            course: updatedCourse,
        });
    })));
    router.delete("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const existingCourse = yield (0, course_1.getCourseById)(req.params.id);
        const course = yield (0, course_1.deleteCourseById)(req.params.id);
        if (!course)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        if (existingCourse) {
            const name = existingCourse.videoTrailerUrl.split("/")[existingCourse.videoTrailerUrl.split("/").length - 1];
            const thumbnail = existingCourse.thumbnail.split("/")[existingCourse.thumbnail.split("/").length - 1];
            const key = `trailers/${name}`;
            const thumbnailKey = `images/${thumbnail}`;
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, s3_1.deleteFromBucket)(config_1.default.bucket_name, key);
                yield (0, s3_1.deleteFromBucket)(config_1.default.bucket_name, thumbnailKey);
            }), 0);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK);
    })));
};
