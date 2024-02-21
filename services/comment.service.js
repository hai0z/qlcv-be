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
      throw new Error("Something went wrong");
    }
  },

  deleteComment: async (commentId) => {
    try {
      await prisma.comment.delete({
        where: {
          id: commentId,
        },
      });
    } catch (error) {
      throw new Error("Something went wrong");
    }
  },
};
