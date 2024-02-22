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
exports.getAdminById = exports.authenticateUser = exports.isAuthorizedUser = exports.logout = exports.saveAccessToken = exports.updateAccount = exports.createAccount = exports.login = exports.findOneUser = void 0;
const entity_1 = __importDefault(require("../entity"));
const lib_1 = require("../lib");
const findOneUser = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield entity_1.default.admin.findOne({
        where: {
            email,
        },
    });
    return user;
});
exports.findOneUser = findOneUser;
const login = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield entity_1.default.admin.findOne({
        where: {
            email: body.email,
        },
    });
    if (!user)
        return user;
    const doPasswordsMatch = yield (0, lib_1.comparePasswords)(body.password, user.password);
    if (!doPasswordsMatch)
        return null;
    return user;
});
exports.login = login;
const createAccount = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const password = yield (0, lib_1.encryptPassword)(body.password);
    return yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        return yield entity_1.default.admin.create(Object.assign(Object.assign({}, body), { password }), { transaction });
    }));
});
exports.createAccount = createAccount;
const updateAccount = (body) => __awaiter(void 0, void 0, void 0, function* () {
    const existingAccount = yield entity_1.default.admin.findByPk(body.id);
    console.log("existingAccount.password = ", existingAccount.password);
    console.log("body.password = ", body.password);
    if (existingAccount.password !== body.password) {
        body.password = yield (0, lib_1.encryptPassword)(body.password);
    }
    return yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        return yield entity_1.default.admin.update(body, {
            where: {
                id: body.id,
            },
        }, { transaction });
    }));
});
exports.updateAccount = updateAccount;
const saveAccessToken = (token, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield entity_1.default.session.create({ adminId, token }, { transaction });
        return result;
    }));
});
exports.saveAccessToken = saveAccessToken;
const logout = (token, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield (0, lib_1.withTransaction)((transaction) => __awaiter(void 0, void 0, void 0, function* () {
        const result = yield entity_1.default.session.destroy({
            where: {
                token,
                adminId,
            },
        }, { transaction });
        return result;
    }));
});
exports.logout = logout;
const isAuthorizedUser = (token, adminId) => __awaiter(void 0, void 0, void 0, function* () {
    return entity_1.default.session.findOne({
        where: {
            token,
            adminId,
        },
    });
});
exports.isAuthorizedUser = isAuthorizedUser;
const authenticateUser = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = (0, lib_1.decodeAccessToken)(token);
    const user = yield (0, exports.findOneUser)(payload.email);
    return user;
});
exports.authenticateUser = authenticateUser;
const getAdminById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const admin = yield entity_1.default.admin.findByPk(id);
    return admin;
});
exports.getAdminById = getAdminById;
