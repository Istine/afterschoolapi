import { Transaction } from "sequelize";
import { withTransaction } from "../lib";
import { lessonType } from "../types";
import db from "../entity";

export const getLessonById = async (id: string) => {
  const results = await db.lesson.findByPk(id);
  return results;
};

export const getAllLessons = async () => {
  const results = await db.lesson.findAll();
  return results;
};

export const updateLessonById = async (id: string, payload: lessonType) => {
  const lesson = await withTransaction(async (transaction: Transaction) => {
    const results = await db.lesson.update(payload, {
      where: {
        id,
      },
      transaction,
    });
    return results;
  });

  return lesson;
};

export const deleteLessonById = async (id: string) => {
  const lesson = await withTransaction(async (transaction: Transaction) => {
    const results = await db.lesson.destroy({
      where: {
        id,
      },
      transaction,
    });
    return results;
  });

  return lesson;
};

export const createLessons = async (data: Array<lessonType>) => {
  const lessons = await withTransaction(async (transaction: Transaction) => {
    const results = await db.lesson.bulkCreate(data, { transaction });
    return results;
  });
  return lessons;
};
