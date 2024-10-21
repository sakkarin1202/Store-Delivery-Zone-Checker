const sequelize = require("./db");
const Sequelize = require("sequelize");
const User = require("./user.model");
const Role = require("./role.model");
const Store = require("./store.model")

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.User = User;
db.Role = Role;
db.Store = Store;

//Association
db.User.belongsToMany(db.Role, {
  through: "user_roles",
});

db.Role.belongsToMany(db.User, {
  through: "user_roles",
});

db.User.hasMany(db.Store, { foreignKey: "adminId" });
db.Store.belongsTo(db.User, { foreignKey: "adminId" });

module.exports = db;