"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Module = sequelize.define("module", {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        duration: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        lessons: {
            type: sequelize_1.DataTypes.JSON,
            defaultValue: [],
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
    return Module;
};
