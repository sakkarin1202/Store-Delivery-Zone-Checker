const { DataTypes } = require("sequelize");
const sequelize = require("./db");

// Define User Schema
const User = sequelize.define("user", {
    userId: {
        type: DataTypes.INTEGER, 
        autoIncrement: true, 
        primaryKey: true, 
    },
    username: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    latitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    longitude: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
});



User.sync({ force: false })
    .then(() => {
        console.log("User table created or already exists");
    })
    .catch((error) => {
        console.log("Error creating User table:", error);
    });

module.exports = User;