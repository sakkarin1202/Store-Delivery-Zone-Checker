const { DataTypes } = require("sequelize");
const sequelize = require("./db");

const Store = sequelize.define("Store", {
  storeName: {
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
  deliveryRadius: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
});

Store.sync({ force: false })
  .then(() => {
    console.log("Store table created or already exists");
  })
  .catch((error) => {
    console.error("Unable to create Store table:", error);
  });

module.exports = Store;
