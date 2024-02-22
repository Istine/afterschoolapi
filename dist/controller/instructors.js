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
const instructor_1 = require("../service/instructor");
const lib_1 = require("../lib");
const http_status_codes_1 = require("http-status-codes");
const s3_1 = require("../service/s3");
const config_1 = __importDefault(require("../config"));
const instructor_2 = require("../middleware/instructor");
exports.default = (app) => {
    const router = express_1.default.Router();
    app.use("/api/instructor", router);
    router.use(express_1.default.raw({
        limit: "10mb",
        type: "multipart/form-data",
        verify: (req, res, buf) => {
            req.rawBody = buf;
        },
    }));
    router.post("/", middleware_1.IsUserAuthorized, instructor_2.multipartFormHander, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const data = yield (0, s3_1.uploadToBucket)(config_1.default.bucket_name, req.body.props.filename, req.body.props.file);
        const createdInstructor = yield (0, instructor_1.createInstructor)(Object.assign(Object.assign({}, req.body.data), { imageUrl: data.Location }));
        if (!createdInstructor) {
            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                yield (0, s3_1.deleteFromBucket)(config_1.default.bucket_name, req.body.data.resourceKey);
            }), 0);
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR, http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
        }
        else
            return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
                instructor: createdInstructor,
            });
    })));
    router.get("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const allInstructors = yield (0, instructor_1.getAllInstructors)();
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            instructors: allInstructors,
        });
    })));
    router.get("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const instructor = yield (0, instructor_1.getInstructorById)(req.params.id);
        if (!instructor)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            instructor,
        });
    })));
    router.delete("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const instructor = yield (0, instructor_1.getInstructorById)(req.params.id);
        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
            yield (0, s3_1.deleteFromBucket)(config_1.default.bucket_name, instructor.resourceKey);
        }), 0);
        const instructorCount = yield (0, instructor_1.delteInstructorById)(req.params.id);
        if (!instructorCount)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK);
    })));
    router.put("/", middleware_1.IsUserAuthorized, instructor_2.multipartFormHander, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        let data = {};
        if (req.body.props.filename) {
            data = yield (0, s3_1.uploadToBucket)(config_1.default.bucket_name, req.body.props.filename, req.body.props.file);
        }
        const instructor = yield (0, instructor_1.updateInstructorById)(req.body.data.id, Object.assign(Object.assign({}, req.body.data), (data.Location && { imageUrl: data.Location })));
        if (!instructor[0])
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            instructor,
        });
    })));
};
