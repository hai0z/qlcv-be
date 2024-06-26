const express = require("express");

const router = express.Router();

const authController = require("../controllers/auth.controller");

router.post("/login", authController.login);

router.post("/logout", authController.logOut);

router.post("/register", authController.register);

router.get("/verify-token", authController.verifyToken);

module.exports = router;
