import { DataTypes, Sequelize } from "sequelize";

export default (sequelize: Sequelize) => {
  const Rating = sequelize.define(
    "rating",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      starCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      timestamps: true,
    }
  );

  return Rating;
};
