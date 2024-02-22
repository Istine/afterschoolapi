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
const express_1 = __importDefault(require("express"));
const middleware_1 = require("../middleware");
const http_status_codes_1 = require("http-status-codes");
const lib_1 = require("../lib");
const lesson_1 = require("../service/lesson");
const s3_1 = require("../service/s3");
const config_1 = __importDefault(require("../config"));
exports.default = (app) => {
    const router = express_1.default.Router();
    app.use("/api/lesson", router);
    router.get("/signed-url", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const { filename, contentType } = req.query;
        const key = `lessons/${filename}`;
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
        const response = yield (0, lesson_1.createLessons)((0, lib_1.transformLessonData)(req.body));
        if (!response.length) {
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.CREATED, http_status_codes_1.ReasonPhrases.CREATED);
    })));
    router.get("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const lessons = yield (0, lesson_1.getAllLessons)();
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            lessons,
        });
    })));
    router.get("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const lesson = yield (0, lesson_1.getLessonById)(req.params.id);
        if (!lesson)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            lesson,
        });
    })));
    router.put("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const body = (0, lib_1.transformLessonData)([req.body]);
        const lessonInStore = yield (0, lesson_1.getLessonById)(req.body.id);
        if (lessonInStore) {
            const key = `lessons/${lessonInStore.title}`;
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, s3_1.deleteFromBucket)(config_1.default.bucket_name, key);
            }), 0);
        }
        const lesson = yield (0, lesson_1.updateLessonById)(req.body.id, body[0]);
        if (!lesson[0]) {
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            lesson,
        });
    })));
    router.delete("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const lesson = yield (0, lesson_1.getLessonById)(req.params.id);
        const deletedLesson = yield (0, lesson_1.deleteLessonById)(req.params.id);
        if (!deletedLesson)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        if (lesson) {
            const key = `lessons/${lesson.title}`;
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, s3_1.deleteFromBucket)(config_1.default.bucket_name, key);
            }), 0);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK);
    })));
};
