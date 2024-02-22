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
exports.getModuleById = exports.getAllModules = exports.deleteModuleById = exports.updateModule = exports.createModules = void 0;
const entity_1 = __importDefault(require("../entity"));
const lib_1 = require("../lib");
const createModules = (modules) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield entity_1.default.module.bulkCreate(modules, {
            transaction,
        });
        return module;
    }));
    return results;
});
exports.createModules = createModules;
const updateModule = (id, payload) => __awaiter(void 0, void 0, void 0, function* () {
    const results = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield entity_1.default.module.update(payload, {
            where: {
                id,
            },
            transaction,
        });
        return module;
    }));
    return results;
});
exports.updateModule = updateModule;
const deleteModuleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const deletedModule = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const module = yield entity_1.default.module.destroy({
            where: {
                id,
            },
            transaction,
        });
        return module;
    }));
    return deletedModule;
});
exports.deleteModuleById = deleteModuleById;
const getAllModules = () => __awaiter(void 0, void 0, void 0, function* () {
    const modules = yield entity_1.default.module.findAll({
    // include: [{ model: db.courseMaterial }],
    });
    return modules;
});
exports.getAllModules = getAllModules;
const getModuleById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const module = yield entity_1.default.module.findByPk(id, {
    // include: [{ model: db.courseMaterial }],
    });
    const lessons = yield entity_1.default.lesson.findAll({
        where: {
            id: module.lessons,
        },
    });
    return Object.assign(Object.assign({}, module.dataValues), { lessons });
});
exports.getModuleById = getModuleById;
