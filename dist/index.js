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
const server_1 = __importDefault(require("./server"));
const entity_1 = __importDefault(require("./entity"));
const config_1 = __importDefault(require("./config"));
const startUp = () => __awaiter(void 0, void 0, void 0, function* () {
    const PORT = config_1.default.port || 3000;
    try {
        yield entity_1.default.sequelize.sync();
        server_1.default.listen(PORT, () => {
            console.info(`Server is running on localhost:${PORT}`);
        });
    }
    catch (error) {
        console.error(error.message);
    }
});
startUp();
