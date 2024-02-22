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
exports.deleteCourseMaterialById = void 0;
const lib_1 = require("../lib");
const entity_1 = __importDefault(require("../entity"));
const deleteCourseMaterialById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const courseMaterial = yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const results = yield entity_1.default.courseMaterial.destroy({
            where: {
                id,
            },
            transaction,
        });
        return results;
    }));
    return courseMaterial;
});
exports.deleteCourseMaterialById = deleteCourseMaterialById;
