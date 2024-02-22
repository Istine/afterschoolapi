import { Transaction } from "sequelize";
import { withTransaction } from "../lib";
import { instructorType } from "../types";
import db from "../entity";

export const createInstructor = async (body: instructorType) => {
  const createdInstructor = await withTransaction(
    async (transaction: Transaction) => {
      const emailExists = await db.instructor.findOne({
        where: { email: body.email },
      });
      if (emailExists) return null;

      const result = await db.instructor.create(body, { transaction });
      return result;
    }
  );
  return createdInstructor;
};

export const getAllInstructors = async () => {
  const allInstructors = await db.instructor.findAll();
  return allInstructors;
};

export const getInstructorById = async (id: string) => {
  const instructor = await db.instructor.findByPk(id);
  return instructor;
};

export const delteInstructorById = async (id: string) => {
  const deletedInstuctor = await withTransaction(
    async (transaction: Transaction) => {
      const result = await db.instructor.destroy({
        where: {
          id,
        },
        transaction,
      });

      return result;
    }
  );

  return deletedInstuctor;
};

export const updateInstructorById = async (
  id: string,
  payload: instructorType
) => {
  const updatedInstructor = await withTransaction(
    async (transaction: Transaction) => {
      const result = await db.instructor.update(payload, {
        where: {
          id,
        },
        transaction,
      });
      return result;
    }
  );

  return updatedInstructor;
};
