const express = require("express");

const router = express.Router();

const workController = require("../controllers/work.controller");

//GET

router.get("/", workController.getAllWork);
router.get("/today", workController.getTodayWork);
router.get("/calendar", workController.getWorkCalendar);
router.get("/chart/:userId", workController.getProgressChart);
router.get("/:id", workController.getWorkById);

//POST
router.post("/add-member/:id", workController.addMember);
router.post("/create-work-request/:id", workController.createWorkRequest);
router.post("/", workController.createWork);

//PUT
router.put("/update-status/:id", workController.updateWorkStatus);
router.put("/update-work-view/:id", workController.updateWorkView);
router.put("/update-work-request/:id", workController.updateWorkRequest);
router.put("/:id", workController.updateWork);

//DELETE
router.delete("/remove-member/:id", workController.removeMember);

router.delete(
  "/delete-work-request/:workRequestId",
  workController.deleteWorkRequest
);

router.delete("/:id", workController.deleteWork);

module.exports = router;
