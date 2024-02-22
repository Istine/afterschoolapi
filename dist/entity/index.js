"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const config_1 = __importDefault(require("../config"));
const admin_1 = __importDefault(require("./admin"));
const session_1 = __importDefault(require("./session"));
const courses_1 = __importDefault(require("./courses"));
const courseMaterial_1 = __importDefault(require("./courseMaterial"));
const lesson_1 = __importDefault(require("./lesson"));
const module_1 = __importDefault(require("./module"));
const rating_1 = __importDefault(require("./rating"));
const instructor_1 = __importDefault(require("./instructor"));
const sequelize = new sequelize_1.Sequelize(config_1.default.database_url, {
    dialect: "postgres",
});
const db = {
    admin: (0, admin_1.default)(sequelize),
    session: (0, session_1.default)(sequelize),
    course: (0, courses_1.default)(sequelize),
    courseMaterial: (0, courseMaterial_1.default)(sequelize),
    lesson: (0, lesson_1.default)(sequelize),
    module: (0, module_1.default)(sequelize),
    rating: (0, rating_1.default)(sequelize),
    instructor: (0, instructor_1.default)(sequelize),
    sequelize,
};
// mdeol associations
db.admin.hasMany(db.session, { foreignKey: "adminId" });
db.session.belongsTo(db.admin, { foreignKey: "adminId" });
db.course.hasMany(db.rating, { foreignKey: "courseId", onDelete: "CASCADE" });
db.rating.belongsTo(db.course, { foreignKey: "courseId" });
db.course.hasMany(db.courseMaterial, {
    foreignKey: "courseId",
    onDelete: "CASCADE",
});
db.courseMaterial.belongsTo(db.course, { foreignKey: "courseId" });
exports.default = db;
