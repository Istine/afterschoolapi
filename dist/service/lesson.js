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
exports.createLessons = exports.deleteLessonById = exports.updateLessonById = exports.getAllLessons = exports.getLessonById = void 0;
const lib_1 = require("../lib");
const entity_1 = __importDefault(require("../entity"));
const getLessonById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield entity_1.default.lesson.findByPk(id);
    return results;
});
exports.getLessonById = getLessonById;
const getAllLessons = () => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield entity_1.default.lesson.findAll();
    return results;
});
exports.getAllLessons = getAllLessons;
const updateLessonById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield entity_1.default.lesson.update(payload, {
            where: {
                id,
            },
            transaction,
        });
        return results;
    }));
    return lesson;
});
exports.updateLessonById = updateLessonById;
const deleteLessonById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield entity_1.default.lesson.destroy({
            where: {
                id,
            },
            transaction,
        });
        return results;
    }));
    return lesson;
});
exports.deleteLessonById = deleteLessonById;
const createLessons = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const lessons = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield entity_1.default.lesson.bulkCreate(data, { transaction });
        return results;
    }));
    return lessons;
});
exports.createLessons = createLessons;
