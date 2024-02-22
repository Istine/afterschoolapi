import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Lesson = sequelize.define(
    "lesson",
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
      description: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      videoUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return Lesson;
};
