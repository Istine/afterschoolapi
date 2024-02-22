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
exports.updateInstructorById = exports.delteInstructorById = exports.getInstructorById = exports.getAllInstructors = exports.createInstructor = void 0;
const lib_1 = require("../lib");
const entity_1 = __importDefault(require("../entity"));
const createInstructor = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const createdInstructor = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const emailExists = yield entity_1.default.instructor.findOne({
            where: { email: body.email },
        });
        if (emailExists)
            return null;
        const result = yield entity_1.default.instructor.create(body, { transaction });
        return result;
    }));
    return createdInstructor;
});
exports.createInstructor = createInstructor;
const getAllInstructors = () => __awaiter(void 0, void 0, void 0, function* () {
    const allInstructors = yield entity_1.default.instructor.findAll();
    return allInstructors;
});
exports.getAllInstructors = getAllInstructors;
const getInstructorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const instructor = yield entity_1.default.instructor.findByPk(id);
    return instructor;
});
exports.getInstructorById = getInstructorById;
const delteInstructorById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedInstuctor = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield entity_1.default.instructor.destroy({
            where: {
                id,
            },
            transaction,
        });
        return result;
    }));
    return deletedInstuctor;
});
exports.delteInstructorById = delteInstructorById;
const updateInstructorById = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const updatedInstructor = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield entity_1.default.instructor.update(payload, {
            where: {
                id,
            },
            transaction,
        });
        return result;
    }));
    return updatedInstructor;
});
exports.updateInstructorById = updateInstructorById;
