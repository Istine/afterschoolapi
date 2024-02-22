import { ExpressType } from "../types";
import admin from "./admin";
import auth from "./auth";
import courseMaterial from "./courseMaterial";
import courses from "./courses";
import instructors from "./instructors";
import lesson from "./lesson";
import modules from "./modules";

export default (app: ExpressType) => {
  admin(app);
  courses(app);
  instructors(app);
  lesson(app);
  courseMaterial(app);
  modules(app);
  auth(app);
};
