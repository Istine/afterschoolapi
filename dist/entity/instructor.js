"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Instructor = sequelize.define("instructor", {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        email: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 3,
            },
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            validate: {
                min: 3,
            },
        },
        imageUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        resourceKey: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        bio: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        specialization: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
    return Instructor;
};
