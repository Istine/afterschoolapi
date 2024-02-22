import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Module = sequelize.define(
    "module",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lessons: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: [], // Default value is an empty array
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return Module;
};
