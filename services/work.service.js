const prisma = require("@prisma/client");
const dayjs = require("dayjs");

const db = new prisma.PrismaClient();

const selectUserFields = {
  id: true,
  name: true,
  avatar: true,
  role: true,
};

const commentCondition = {
  include: {
    createdBy: {
      select: selectUserFields,
    },
  },
};

const implementerCondition = {
  where: {
    accepted: {
      not: "DECLINED",
    },
  },
  include: {
    request: {
      include: {
        createdBy: {
          select: selectUserFields,
        },
      },
    },
    user: {
      select: selectUserFields,
    },
  },
};

const implementerWhere = (user) => ({
  OR: [
    {
      implementer: {
        some: {
          AND: [
            {
              userId: user.id,
            },
            {
              accepted: {
                not: "DECLINED",
              },
            },
          ],
        },
      },
    },
    {
      userId: user.id,
    },
  ],
});

module.exports = {
  createWork: async (work, user) => {
    const data = await db.work.create({
      data: {
        ...work,
        userId: user.id,
      },
    });
    writeWorkLog(user.id, data.id, "CREATED_WORK");
    return data.id;
  },

  getAllWork: async (user, page = 1, limit = 5) => {
    if (user.role === "ADMIN") {
      const workCount = await db.work.count();
      const data = await db.work.findMany({
        include: {
          comments: commentCondition,
          createdBy: {
            select: selectUserFields,
          },
          implementer: implementerCondition,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: Number(limit),
        skip: Number(limit) * (page - 1),
      });
      return {
        data,
        totalPage: Math.ceil(workCount / Number(limit)),
      };
    } else {
      const workCount = await db.work.count({
        where: implementerWhere,
      });
      const data = await db.work.findMany({
        include: {
          comments: commentCondition,
          createdBy: {
            select: selectUserFields,
          },
          implementer: implementerCondition,
        },
        orderBy: {
          createdAt: "desc",
        },
        where: implementerWhere(user),
        take: Number(limit),
        skip: (page - 1) * Number(limit),
      });
      return {
        data,
        totalPage: Math.ceil(workCount / Number(limit)),
      };
    }
  },

  getWorkCalender: async (user) => {
    if (user.role === "ADMIN") {
      const data = await db.work.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });
      data;
    } else {
      const data = await db.work.findMany({
        orderBy: {
          createdAt: "desc",
        },
        where: implementerWhere(user),
      });
      return data;
    }
  },

  getWorkById: async (workId, user) => {
    try {
      const data = await db.work.findUnique({
        where: {
          id: workId,
          implementer: {
            some: {
              userId: user.id,
            },
          },
        },
        include: {
          comments: commentCondition,
          createdBy: {
            select: selectUserFields,
          },
          implementer: implementerCondition,
        },
      });
      return data;
    } catch (error) {
      throw new Error("Work not found");
    }
  },

  updateWorkView: async (workId) => {
    await db.work.update({
      where: {
        id: workId,
      },
      data: {
        views: {
          increment: 1,
        },
      },
    });
  },

  getTodayWork: async (user) => {
    const todayStart = dayjs().startOf("day").toDate();
    const todayEnd = dayjs().endOf("day").toDate();
    const data = await db.work.findMany({
      where: {
        startTime: {
          gte: todayStart,
          lt: todayEnd,
        },
        OR: [
          {
            implementer: {
              some: {
                AND: [
                  {
                    userId: user.id,
                  },
                  {
                    accepted: {
                      not: "DECLINED",
                    },
                  },
                ],
              },
            },
          },
          {
            userId: user.id,
          },
        ],
      },
      include: {
        createdBy: {
          select: {
            avatar: true,
            name: true,
          },
        },
        implementer: {
          where: {
            accepted: {
              not: "DECLINED",
            },
          },
          include: {
            request: true,
          },
        },
      },
    });
    return data;
  },

  deleteWork: async (workId) => {
    await db.work.delete({
      where: {
        id: workId,
      },
    });
  },

  acceptWork: async (workId, userId) => {
    await db.workImplementer.updateMany({
      where: {
        userId,
        workId,
      },
      data: {
        accepted: "ACCEPTED",
      },
    });
    writeWorkLog(userId, workId, "ACCEPTED_WORK");
  },

  declineWork: async (workId, userId) => {
    await db.workImplementer.deleteMany({
      where: {
        userId,
        workId,
      },
    });
    writeWorkLog(userId, workId, "DECLINED_WORK");
  },

  writeWorkLog: async (userId, workId, type) => {
    const getLogType = () => {
      switch (type) {
        case "ACCEPTED_WORK":
          return "chấp nhận công việc";
        case "ADD_WORK_REQUEST":
          return "thêm yêu cầu cho công việc";
        case "ADD_MEMBER":
          return "thêm người thực hiện công việc";
        case "COMMENT":
          return "thêm 1 bình luận";
        case "CREATED_WORK":
          return "tạo mới 1 công việc";
        case "DECLINED_WORK":
          return "từ chối công việc";
        case "PAUSED_WORK":
          return "chuyển trạng thái công việc sang tạm dừng";
        case "COMPLETED_WORK":
          return "chuyển trạng thái công việc sang hoàn thành";
        case "COMPLETED_WORK_REQUEST":
          return "hoàn thành 1 yêu cầu của công việc";
        case "REMOVE_MEMBER":
          return "xoá người thực hiện khỏi công việc";
        case "CONTINUE_WORK":
          return "chuyển trạng thái công việc sang đang thực hiện";
        case "REQUEST_TO_COMPLETED":
          return "gửi yêu cầu duyệt công việc";
      }
    };
    const user = await db.user.findUnique({
      where: {
        id: userId,
      },
    });
    await db.workLog.create({
      data: {
        userId,
        workId,
        LOG_TYPE: type,
        content: `${user?.name} đã ${getLogType()}`,
      },
    });
  },

  getWorkLog: async (workId) => {
    const data = await db.workLog.findMany({
      where: {
        workId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    return data;
  },

  updateWorkStatus: async (workId, status, user) => {
    await db.work.update({
      where: {
        id: workId,
      },
      data: {
        status,
      },
    });
    switch (status) {
      case "COMPLETED":
        writeWorkLog(user.id, workId, "COMPLETED_WORK");
        break;
      case "PAUSE":
        writeWorkLog(user.id, workId, "PAUSED_WORK");
        break;
      case "IN_PROGRESS":
        writeWorkLog(user.id, workId, "CONTINUE_WORK");
        break;
      case "PENDING":
        writeWorkLog(user.id, workId, "REQUEST_TO_COMPLETED");
        break;
    }
  },
  updateWork: async (workId, work) => {
    await db.work.update({
      where: {
        id: workId,
      },
      data: {
        ...work,
      },
    });
  },
};
