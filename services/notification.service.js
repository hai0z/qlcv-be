const prisma = require("@prisma/client");

const db = new prisma.PrismaClient();

module.exports = {
  getAllNotification: async (user) => {
    if (user.role === "ADMIN") {
      const data = await db.notification.findMany({
        orderBy: {
          timestamp: "desc",
        },
        include: {
          sender: {
            select: {
              name: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
      });
      return data;
    } else {
      const data = await db.notification.findMany({
        where: {
          receiverId: user.id,
        },
        orderBy: {
          timestamp: "desc",
        },
        include: {
          sender: {
            select: {
              name: true,
              avatar: true,
            },
          },
          receiver: {
            select: {
              name: true,
              avatar: true,
            },
          },
        },
        take: 20,
      });
      return data;
    }
  },
  createNotification: async (senderId, receiverId, workId, message) => {
    try {
      return await db.notification.create({
        data: {
          senderId,
          receiverId,
          message,
          workId,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateNotification: async (id) => {
    try {
      return await db.notification.update({
        where: {
          notification_id: id,
        },
        data: {
          isRead: true,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
