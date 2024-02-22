"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const admin_1 = __importDefault(require("./admin"));
const auth_1 = __importDefault(require("./auth"));
const courseMaterial_1 = __importDefault(require("./courseMaterial"));
const courses_1 = __importDefault(require("./courses"));
const instructors_1 = __importDefault(require("./instructors"));
const lesson_1 = __importDefault(require("./lesson"));
const modules_1 = __importDefault(require("./modules"));
exports.default = (app) => {
    (0, admin_1.default)(app);
    (0, courses_1.default)(app);
    (0, instructors_1.default)(app);
    (0, lesson_1.default)(app);
    (0, courseMaterial_1.default)(app);
    (0, modules_1.default)(app);
    (0, auth_1.default)(app);
};
