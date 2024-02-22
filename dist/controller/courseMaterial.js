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
const courseMaterial_1 = require("../service/courseMaterial");
const http_status_codes_1 = require("http-status-codes");
const lib_1 = require("../lib");
exports.default = (app) => {
    const router = express_1.default.Router();
    app.use("/api/courseMaterial", router);
    router.delete("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const deletedCourseMaterial = yield (0, courseMaterial_1.deleteCourseMaterialById)(req.params.id);
        if (!deletedCourseMaterial)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK);
    })));
};
