const express = require("express");

const router = express.Router();

const userController = require("../controllers/user.controller");

const requireAdmin = require("../middlewares/requireAdmin");

router.get("/", userController.getUsers);

router.get("/:id", userController.getUserById);

router.post("/", [requireAdmin], userController.createUser);

router.put("/change-password/:id", userController.changePassword);

router.put("/reset-password/:id", [requireAdmin], userController.resetPassword);

router.put("/:id", userController.updateUser);

router.delete("/:id", [requireAdmin], userController.deleteUser);

module.exports = router;
