const jwt = require("jsonwebtoken");
const config = require("../config/auth.consfig");
const db = require("../models");
const { use } = require("../routers/auth.router");
const User = db.User;

//localhost:5000/api/v1/auth/signup
//verify token
const verifyToken = (req, res, next) => {
  let token = req.headers["x-access-token"];
  //1st verify
  if (!token) {
    return res.status(403).send({ message: "No token provided" });
  }
  jwt.verify(token, config.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: "Unauthorized!" }); 
    }
    req.userId = decoded.id;
    next();
  });
};


//isAdmin?
isAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin") {
          next();
          return;
        }
      }
      return res
        .status(401)
        .send({ message: "Unauthorized,require Admin role" });
    });
  });
};

//isMod
isMod = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "moderator") {
          next();
          return;
        }
      }
      return res
        .status(401)
        .send({ message: "Unauthorized,require Admin role" });
    });
  });
};

//IsAddminOrmod?
isModOrAdmin = (req, res, next) => {
  User.findByPk(req.userId).then((user) => {
    user.getRoles().then((roles) => {
      for (let i = 0; i < roles.length; i++) {
        if (roles[i].name === "admin" || roles[i].name === "moderator") {
          next();
          return;
        }
      }
      return res
        .status(401)
        .send({ message: "Unauthorized,require Admin or moderator role" });
    });
  });
};

const authJwt = {
  verifyToken,
  isAdmin,
  isMod,
  isModOrAdmin,
};
module.exports = authJwt;
