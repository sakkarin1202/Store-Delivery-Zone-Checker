const express = require("express");
const router = express.Router();
const storeController = require("../controllers/store.controller");
const { authJwt } = require("../middlewares");

//http://localhost:5000/api/v1/store
router.post(
  "/",
  [authJwt.verifyToken, authJwt.isModOrAdmin],
  storeController.createStore
);

//http://localhost:5000/api/v1/store/
router.get("/", storeController.getAllStores);

//http://localhost:5000/api/v1/store/id
router.get("/:id", [authJwt.verifyToken], storeController.getStoreById);

//http://localhost:5000/api/v1/store/id
router.put(
  "/:id",
  [authJwt.verifyToken, authJwt.isModOrAdmin],
  storeController.updateStore
);

//http://localhost:5000/api/v1/store/id
router.delete(
  "/:id",
  [authJwt.verifyToken, authJwt.isAdmin],
  storeController.deleteStore
);

module.exports = router;
