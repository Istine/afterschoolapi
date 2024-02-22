import { courseMaterialInputType, moduleType } from "../types";
import db from "../entity";
import { withTransaction } from "../lib";
import { Transaction } from "sequelize";

export const createModules = async (modules: moduleType) => {
  const results = await withTransaction(async (transaction: Transaction) => {
    const module = await db.module.bulkCreate(modules, {
      transaction,
    });

    return module;
  });

  return results;
};

export const updateModule = async (id: string, payload: moduleType) => {
  const results = await withTransaction(async (transaction: Transaction) => {
    const module = await db.module.update(payload, {
      where: {
        id,
      },
      transaction,
    });

    return module;
  });

  return results;
};

export const deleteModuleById = async (id: string) => {
  const deletedModule = await withTransaction(
    async (transaction: Transaction) => {
      const module = await db.module.destroy({
        where: {
          id,
        },
        transaction,
      });
      return module;
    }
  );

  return deletedModule;
};

export const getAllModules = async () => {
  const modules = await db.module.findAll({
    // include: [{ model: db.courseMaterial }],
  });
  return modules;
};

export const getModuleById = async (id: string) => {
  const module = await db.module.findByPk(id, {
    // include: [{ model: db.courseMaterial }],
  });
  const lessons = await db.lesson.findAll({
    where: {
      id: module.lessons,
    },
  });

  return { ...module.dataValues, lessons };
};
