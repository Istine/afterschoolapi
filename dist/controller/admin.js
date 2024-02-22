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
const admin_1 = require("../service/admin");
const http_status_codes_1 = require("http-status-codes");
const lib_1 = require("../lib");
exports.default = (app) => {
    const router = express_1.default.Router();
    app.use("/api", router);
    router.get("/admin", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield (0, admin_1.getAdminById)(req.admin);
        if (!admin) {
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        }
        return (0, lib_1.successResponse)(res, http_status_codes_1.StatusCodes.OK, http_status_codes_1.ReasonPhrases.OK, { admin });
    })));
    router.post("/admin", middleware_1.IsUserAuthorized, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const admin = yield (0, admin_1.updateAccount)(req.body);
        if (!admin[0]) {
            return (0, lib_1.errorResponse)(res, http_status_codes_1.StatusCodes.NOT_FOUND, http_status_codes_1.ReasonPhrases.NOT_FOUND);
        }
        const jwtPayload = { email: req.body.email };
        const token = yield (0, lib_1.createAccessToken)(jwtPayload);
        if (!token)
            throw new Error("error creating user token");
        const storedToken = yield (0, admin_1.saveAccessToken)(token, req.body.id);
        return res
            .cookie("jwt", storedToken.token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
            sameSite: "strict", // Helps protect against cross-site request forgery (CSRF) attacks
        })
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: http_status_codes_1.ReasonPhrases.OK, admin });
    })));
    router.post("/create", (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, admin_1.createAccount)(req.body);
        if (!user)
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ message: http_status_codes_1.ReasonPhrases.NOT_FOUND });
        return res
            .status(http_status_codes_1.StatusCodes.CREATED)
            .json({ message: http_status_codes_1.ReasonPhrases.CREATED });
    })));
    router.post("/login", middleware_1.validateLoginData, (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield (0, admin_1.login)(req.body);
        if (!user)
            return res
                .status(http_status_codes_1.StatusCodes.NOT_FOUND)
                .json({ message: http_status_codes_1.ReasonPhrases.NOT_FOUND });
        const jwtPayload = { email: user.email };
        const token = yield (0, lib_1.createAccessToken)(jwtPayload);
        if (!token)
            throw new Error("error creating user token");
        const storedToken = yield (0, admin_1.saveAccessToken)(token, user.id);
        return res
            .cookie("jwt", storedToken.token, {
            httpOnly: true,
            secure: false,
            maxAge: 3600000,
            sameSite: "strict", // Helps protect against cross-site request forgery (CSRF) attacks
        })
            .status(http_status_codes_1.StatusCodes.OK)
            .json({ message: http_status_codes_1.ReasonPhrases.OK });
    })));
    router.get("/logout", (0, middleware_1.errorHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        let token;
        token = req.cookies.jwt;
        if (!token) {
            token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1].trim();
        }
        const user = yield (0, admin_1.authenticateUser)(token);
        yield (0, admin_1.logout)(token, user.id);
        res.clearCookie("jwt");
        return res.status(http_status_codes_1.StatusCodes.OK).send(http_status_codes_1.ReasonPhrases.OK);
    })));
};
