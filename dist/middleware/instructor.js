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
exports.multipartFormHander = void 0;
const _1 = require(".");
const busboy_1 = __importDefault(require("busboy"));
exports.multipartFormHander = (0, _1.errorHandler)((req, res, next) => {
    const fields = {};
    const IMAGES_FOLDER = "images/";
    const uploadProps = {};
    const bb = (0, busboy_1.default)({
        headers: req.headers,
    });
    bb.on("field", (name, value, info) => {
        fields[name] = value;
    });
    bb.on("file", (name, file, info) => __awaiter(void 0, void 0, void 0, function* () {
        const { filename } = info;
        uploadProps.filename = IMAGES_FOLDER + filename;
        fields.resourceKey = IMAGES_FOLDER + filename;
        uploadProps.file = file;
    }))
        .on("error", (error) => {
        console.error(error.message);
    })
        .end(req.rawBody);
    req.body = { data: Object.assign(Object.assign({}, req.body), fields), props: Object.assign({}, uploadProps) };
    next();
});
