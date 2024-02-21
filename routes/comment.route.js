const express = require("express");

const router = express.Router();

const commentController = require("../controllers/comment.controller");

//POST
router.post("/", commentController.createComment);

//DELETE
router.delete("/:id", commentController.deleteComment);

module.exports = router;
