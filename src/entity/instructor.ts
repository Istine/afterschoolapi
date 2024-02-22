import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Instructor = sequelize.define(
    "instructor",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },

      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },

      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 3,
        },
      },

      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          min: 3,
        },
      },

      imageUrl: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      resourceKey: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      bio: {
        type: DataTypes.TEXT,
        allowNull: false,
      },

      specialization: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      timestamps: true,
    }
  );

  return Instructor;
};
