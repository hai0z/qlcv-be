const prisma = require("@prisma/client");

const { writeWorkLog } = require("./work.service");

const db = new prisma.PrismaClient();

module.exports = {
  createComment: async (workId, content, user) => {
    try {
      await db.comment.create({
        data: {
          content,
          userId: user.id,
          workId,
        },
      });
      writeWorkLog(user.id, workId, "COMMENT");
    } catch (error) {
      throw new Error(error.message);
    }
  },

  deleteComment: async (commentId) => {
    try {
      await db.comment.delete({
        where: {
          id: commentId,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
