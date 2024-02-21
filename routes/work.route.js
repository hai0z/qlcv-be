const express = require("express");

const router = express.Router();

const workController = require("../controllers/work.controller");

//GET
router.get("/", workController.getAllWork);
router.get("/today", workController.getTodayWork);
router.get("/calender", workController.getWorkCalender);
router.get("/:id", workController.getWorkById);
router.get("/work-log/:id", workController.getWorkLog);

//POST
router.post("/", workController.createWork);
router.post("/accepted-work", workController.acceptWork);
router.post("/decline-work", workController.declineWork);

//PUT
router.put("/:id", workController.updateWork);
router.put(
  "/update-status/:id",

  workController.updateWorkStatus
);
router.put(
  "/update-work-view/:id",

  workController.updateWorkView
);

//DELETE
router.delete("/:id", workController.deleteWork);
module.exports = router;
