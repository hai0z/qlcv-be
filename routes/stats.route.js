const express = require("express");

const router = express.Router();

const statsController = require("../controllers/stats.controller");
const requireAdmin = require("../middlewares/requireAdmin");

//GET
router.get("/", [requireAdmin], statsController.getStats);

module.exports = router;
