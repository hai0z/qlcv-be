const commentService = require("../services/comment.service");

module.exports = {
  createComment: async (req, res) => {
    const { workId, content } = req.body;
    const user = req.user;
    console.log(user);
    try {
      await commentService.createComment(workId, content, user);
      res.status(200).json({ message: "Comment created successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  deleteComment: async (req, res) => {
    const { id } = req.params;
    try {
      await commentService.deleteComment(id);
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
