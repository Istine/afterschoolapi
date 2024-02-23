"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = require("http-status-codes");
const controller_1 = __importDefault(require("../controller"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const app = (0, express_1.default)();
app.use(express_1.default.json({ limit: "50mb" }));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.urlencoded({ extended: true, limit: "50mb" }));
app.use((0, cors_1.default)({
    origin: ["https://afterschoolapp.vercel.app"],
    credentials: true,
}));
(0, controller_1.default)(app);
app.all("*", (req, res) => {
    res.status(404).send("not found");
});
app.use((error, req, res, next) => {
    console.log(error);
    if (res.headersSent) {
        console.log(error.message);
    }
    else {
        res
            .status(http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR)
            .send(http_status_codes_1.ReasonPhrases.INTERNAL_SERVER_ERROR);
    }
});
exports.default = app;
