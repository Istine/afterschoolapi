import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const CourseMaterial = sequelize.define(
    "courseMaterial",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return CourseMaterial;
};
