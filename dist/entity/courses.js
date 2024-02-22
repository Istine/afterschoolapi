"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
exports.default = (sequelize) => {
    const Courses = sequelize.define("course", {
        id: {
            type: sequelize_1.DataTypes.UUID,
            defaultValue: sequelize_1.DataTypes.UUIDV4,
            primaryKey: true,
        },
        courseObjectives: {
            type: sequelize_1.DataTypes.JSON,
            defaultValue: [],
            allowNull: false,
        },
        modules: {
            type: sequelize_1.DataTypes.JSON,
            defaultValue: [],
            allowNull: false,
        },
        teachers: {
            type: sequelize_1.DataTypes.JSON,
            defaultValue: [],
            allowNull: false,
        },
        title: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: sequelize_1.DataTypes.TEXT,
            allowNull: false,
        },
        price: {
            type: sequelize_1.DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 0,
        },
        duration: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        videoTrailerUrl: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        category: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        thumbnail: {
            type: sequelize_1.DataTypes.STRING,
            allowNull: false,
        },
        language: {
            type: sequelize_1.DataTypes.JSON,
            defaultValue: [],
            allowNull: false,
        },
    }, {
        timestamps: true,
    });
    return Courses;
};
