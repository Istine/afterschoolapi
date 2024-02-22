import { courseType } from "../types";
import db from "../entity";
import { transformCourseData, withTransaction } from "../lib";
import { Transaction } from "sequelize";

export const createCourse = (courseData: courseType) =>
  withTransaction(async (transaction: Transaction) => {
    const course = await db.course.create(transformCourseData(courseData), {
      transaction,
    });
    return course;
  });

export const getCourses = async () => {
  const courses = await db.course.findAll({
    include: [{ model: db.courseMaterial, as: "courseMaterials" }],
  });
  return courses;
};

export const getCourseById = async (id: string) => {
  return await db.course.findByPk(id, {
    include: [{ model: db.courseMaterial, as: "courseMaterials" }],
  });
};

export const updateCourseById = async (id: string, payload: courseType) => {
  const updateTransaction = withTransaction(
    async (transaction: Transaction) =>
      await db.course.update(payload, {
        where: {
          id,
        },
        transaction,
      })
  );

  return updateTransaction;
};

export const deleteCourseById = async (id: string) => {
  const results = await withTransaction(async (transaction: Transaction) => {
    const course = await db.course.destroy({
      where: {
        id,
      },
      transaction,
    });
    return course;
  });
  return results;
};
