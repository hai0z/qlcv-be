const express = require("express");

const router = express.Router();

const workController = require("../controllers/work.controller");

const verifyToken = require("../middlewares/auth.middleware");

//GET
router.get("/", [verifyToken], workController.getAllWork);
router.get("/today", [verifyToken], workController.getTodayWork);
router.get("/:id", [verifyToken], workController.getWorkById);
router.get("/work-log/:id", [verifyToken], workController.getWorkLog);

//POST
router.post("/", [verifyToken], workController.createWork);
router.post("/accepted-work:id", [verifyToken], workController.acceptWork);
router.post("/decline-work:id", [verifyToken], workController.declineWork);

//PUT
router.put("/:id", [verifyToken], workController.updateWork);
router.put(
  "/update-status/:id",
  [verifyToken],
  workController.updateWorkStatus
);
router.put(
  "/update-work-view/:id",
  [verifyToken],
  workController.updateWorkView
);

//DELETE
router.delete("/:id", [verifyToken], workController.deleteWork);
module.exports = router;
