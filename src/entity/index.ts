import { Sequelize } from "sequelize";
import config from "../config";
import admin from "./admin";
import session from "./session";
import course from "./courses";
import courseMaterial from "./courseMaterial";
import lesson from "./lesson";
import module from "./module";
import rating from "./rating";
import instructor from "./instructor";

const sequelize = new Sequelize(config.database_url);

const db: {
  [key: string]: any;
} = {
  admin: admin(sequelize),
  session: session(sequelize),
  course: course(sequelize),
  courseMaterial: courseMaterial(sequelize),
  lesson: lesson(sequelize),
  module: module(sequelize),
  rating: rating(sequelize),
  instructor: instructor(sequelize),
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

export default db;
