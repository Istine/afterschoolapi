import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Courses = sequelize.define(
    "course",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      courseObjectives: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: [], // Default value is an empty array
        allowNull: false,
      },

      modules: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: [], // Default value is an empty array
        allowNull: false,
      },
      teachers: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: [], // Default value is an empty array
        allowNull: false,
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

      price: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },

      duration: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      videoTrailerUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      category: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      thumbnail: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      language: {
        type: DataTypes.JSON, // Array of strings
        defaultValue: [], // Default value is an empty array
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );
  return Courses;
};
