const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// Define Role Schema
const Role = sequelize.define("role", {
    roleId: { 
        type: DataTypes.INTEGER, 
        primaryKey: true,
        autoIncrement: true, 
        allowNull: false,
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
});

module.exports = Role;
