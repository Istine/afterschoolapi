"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Admin = sequelize.define("admin", {
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
        password: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            validate: {
                min: 6,
            },
        },
        firstName: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            validate: {
                min: 3,
                max: 30,
            },
        },
        lastName: {
            type: sequelize_1.DataTypes.STRING(64),
            allowNull: false,
            validate: {
                min: 3,
                max: 30,
            },
        },
    }, {
        timestamps: true,
    });
    return Admin;
};
