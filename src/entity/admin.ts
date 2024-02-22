import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Admin = sequelize.define(
    "admin",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use UUIDV4 to generate a random UUID
        primaryKey: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          min: 6,
        },
      },
      firstName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          min: 3,
          max: 30,
        },
      },
      lastName: {
        type: DataTypes.STRING(64),
        allowNull: false,
        validate: {
          min: 3,
          max: 30,
        },
      },
    },
    {
      timestamps: true,
    }
  );

  return Admin;
};
