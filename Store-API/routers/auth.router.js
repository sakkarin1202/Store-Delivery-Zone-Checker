const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");
//const { verifySignUp } = require("../middlewares");
const verifySignUp = require("../middlewares/verifySignUp");

console.log(verifySignUp);
router.use((req, res, next) => {
  res.header(
    "Access-Control-Allow-Headers",
    "x-access-token,Origin,Content-Type,Accept"
  );
  next();
});


  //http://localhost:5000/api/v1/auth/signup
router.post(
  "/signup",
  [verifySignUp.checkDuplicateUsernameOrEmail, verifySignUp.checkRolesExisted],
  authController.signup
);

http://localhost:5000/api/v1/auth/signin
router.post("/signin", authController.signin);

module.exports = router;



