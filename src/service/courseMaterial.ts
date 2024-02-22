import { Transaction } from "sequelize";
import { withTransaction } from "../lib";
import db from "../entity";

export const deleteCourseMaterialById = async (id: string) => {
  const courseMaterial = await withTransaction(
    async (transaction: Transaction) => {
      const results = await db.courseMaterial.destroy({
        where: {
          id,
        },
        transaction,
      });
      return results;
    }
  );

  return courseMaterial;
};
