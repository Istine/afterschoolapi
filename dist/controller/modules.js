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
const module_1 = require("../service/module");
const lib_1 = require("../lib");
const http_status_codes_1 = require("http-status-codes");
exports.default = (app) => {
    const router = express_1.default.Router();
    app.use("/api/module", router);
    router.post("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const modules = yield (0, module_1.createModules)(req.body);
        if (!modules) {
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.CREATED, http_status_codes_1.ReasonPhrases.CREATED, {
            modules,
        });
    })));
    router.put("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const updatedModule = yield (0, module_1.updateModule)(req.body.id, req.body);
        if (!updatedModule) {
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            module: updatedModule,
        });
    })));
    router.get("/", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const modules = yield (0, module_1.getAllModules)();
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            modules,
        });
    })));
    router.get("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield (0, module_1.getModuleById)(req.params.id);
        if (!module) {
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, {
            module,
        });
    })));
    router.delete("/:id", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield (0, module_1.deleteModuleById)(req.params.id);
        if (!module)
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.BAD_REQUEST, http_status_codes_1.ReasonPhrases.BAD_REQUEST);
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK);
    })));
};
