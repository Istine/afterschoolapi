import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Session = sequelize.define(
    "session",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4, // Use UUIDV4 to generate a random UUID
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      timestamps: true,
    }
  );

  return Session;
};
