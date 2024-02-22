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
exports.deleteCourseById = exports.updateCourseById = exports.getCourseById = exports.getCourses = exports.createCourse = void 0;
const entity_1 = __importDefault(require("../entity"));
const lib_1 = require("../lib");
const createCourse = (courseData) => (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield entity_1.default.course.create((0, lib_1.transformCourseData)(courseData), {
        transaction,
    });
    return course;
}));
exports.createCourse = createCourse;
const getCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield entity_1.default.course.findAll({
        include: [{ model: entity_1.default.courseMaterial, as: "courseMaterials" }],
    });
    return courses;
});
exports.getCourses = getCourses;
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    return yield entity_1.default.course.findByPk(id, {
        include: [{ model: entity_1.default.courseMaterial, as: "courseMaterials" }],
    });
});
exports.getCourseById = getCourseById;
const updateCourseById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updateTransaction = (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        return yield entity_1.default.course.update(payload, {
            where: {
                id,
            },
            transaction,
        });
    }));
    return updateTransaction;
});
exports.updateCourseById = updateCourseById;
const deleteCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const course = yield entity_1.default.course.destroy({
            where: {
                id,
            },
            transaction,
        });
        return course;
    }));
    return results;
});
exports.deleteCourseById = deleteCourseById;
