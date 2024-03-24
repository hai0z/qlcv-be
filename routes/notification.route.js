const express = require("express");
const notificationController = require("../controllers/notification.controller");
const router = express.Router();

//GET
router.get("/", notificationController.getAllNotification);
//POST
router.post("/", notificationController.createNotification);
// PUT
router.put("/:id", notificationController.updateNotification);

module.exports = router;
