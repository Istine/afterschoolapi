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
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.validatePaginationConstraints = exports.IsUserAuthorized = exports.validateLoginData = void 0;
const lib_1 = require("../lib");
const admin_1 = require("../service/admin");
const http_status_codes_1 = require("http-status-codes");
const validateLoginData = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, lib_1.validateData)(req.body);
        next();
    }
    catch (error) {
        return res
            .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
            .json({ errors: error.errors });
    }
});
exports.validateLoginData = validateLoginData;
const IsUserAuthorized = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        let jwt;
        jwt = req.cookies.jwt;
        if (!jwt) {
            jwt = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1].trim();
        }
        const user = yield (0, admin_1.authenticateUser)(jwt);
        if (!user) {
            res.clearCookie("jwt");
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .send(http_status_codes_1.ReasonPhrases.BAD_REQUEST);
        }
        const token = yield (0, admin_1.isAuthorizedUser)(jwt, user.id);
        if (!token) {
            res.clearCookie("jwt");
            return res
                .status(http_status_codes_1.StatusCodes.UNAUTHORIZED)
                .send(http_status_codes_1.ReasonPhrases.UNAUTHORIZED);
        }
        req.admin = user.id;
        return next();
    }
    catch (error) {
        next(error);
    }
});
exports.IsUserAuthorized = IsUserAuthorized;
const validatePaginationConstraints = (req, res, next) => {
    try {
        const page = req.query.page;
        const limit = req.query.limit;
        if (isNaN(page) || isNaN(limit) || page <= 0 || limit <= 0) {
            return res
                .status(http_status_codes_1.StatusCodes.BAD_REQUEST)
                .json({ error: "Invalid page or limit parameters" });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
exports.validatePaginationConstraints = validatePaginationConstraints;
const errorHandler = (handler) => (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield handler(req, res, next);
    }
    catch (error) {
        next(error);
    }
});
exports.errorHandler = errorHandler;
