const prisma = require("@prisma/client");
const dayjs = require("dayjs");

const db = new prisma.PrismaClient();
const x = {};
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
  orderBy: {
    createdAt: "desc",
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
      orderBy: {
        createdAt: "desc",
      },
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

module.exports.writeWorkLog = async (userId, workId, type) => {
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
};
module.exports.workService = {
  createWork: async (work, user) => {
    try {
      const data = await db.work.create({
        data: {
          ...work,
          userId: user.id,
        },
      });
      this.writeWorkLog(user.id, data.id, "CREATED_WORK");
      return data.id;
    } catch (error) {
      throw new Error(error);
    }
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
        where: implementerWhere(user),
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

  getWorkCalendar: async (user) => {
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
          OR: [
            {
              userId: user.id,
            },
            {
              implementer: {
                some: {
                  id: user.id,
                },
              },
            },
          ],
        },
        include: {
          comments: commentCondition,
          createdBy: {
            select: selectUserFields,
          },
          WorkLog: {
            orderBy: {
              createdAt: "desc",
            },
          },
          implementer: implementerCondition,
        },
      });
      return data;
    } catch (error) {
      throw new Error("Work not found");
    }
  },

  getProgressChart: async (user) => {
    const getWorkProgress = (data) => ({
      inProgress: data.filter((work) => work.status === "IN_PROGRESS").length,
      completed: data.filter((work) => work.status === "COMPLETED").length,
      pause: data.filter((work) => work.status === "PAUSE").length,
      pending: data.filter((work) => work.status === "PENDING").length,
      new: data.filter((work) => work.status === "NEW").length,
    });
    if (user.role === "ADMIN") {
      const workCount = await db.work.count();
      const data = await db.work.findMany();
      return {
        data: getWorkProgress(data),
        totalWork: workCount,
      };
    } else {
      const workCount = await db.work.count({
        where: implementerWhere(user),
      });
      const data = await db.work.findMany({
        where: implementerWhere(user),
      });
      return {
        data: getWorkProgress(data),
        totalWork: workCount,
      };
    }
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
            userId: user.id,
          },
          {
            implementer: {
              some: {
                id: user.id,
              },
            },
          },
        ],
      },
      include: {
        createdBy: {
          select: selectUserFields,
        },
        implementer: {
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
    this.writeWorkLog(userId, workId, "ACCEPTED_WORK");
  },

  declineWork: async (workId, userId) => {
    await db.workImplementer.deleteMany({
      where: {
        userId,
        workId,
      },
    });
    this.writeWorkLog(userId, workId, "DECLINED_WORK");
  },
  addMemberToWork: async (workId, userId) => {
    try {
      const work = await db.work.findUnique({
        where: {
          id: workId,
        },
      });
      if (!work) {
        throw new Error("Work not found");
      }
      const userHasInWork = await db.workImplementer.findUnique({
        where: {
          workId,
          userId,
        },
      });
      if (userHasInWork) {
        throw new Error("User already in work");
      }
      await db.workImplementer.create({
        data: {
          workId,
          userId,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  removeMemberToWork: async (workId, userId) => {
    const userHasInWork = await db.workImplementer.findUnique({
      where: {
        workId,
        userId,
      },
    });
    if (!userHasInWork) {
      throw new Error("User not in work");
    }
    try {
      await db.workImplementer.deleteMany({
        where: {
          workId,
          userId,
        },
      });
    } catch (error) {
      throw new Error(error.message);
    }
  },
  createWorkRequest: async (title, workImplementerId, userId) => {
    await db.workRequest.create({
      data: {
        userId,
        title,
        isCompleted: false,
        workImplementerId,
      },
    });
  },
  updateWorkRequest: async (workRequestId, data, user) => {
    await db.workRequest.updateMany({
      where: {
        id: workRequestId,
      },
      data: {
        ...data,
        userId: user.id,
      },
    });
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
        this.writeWorkLog(user.id, workId, "COMPLETED_WORK");
        break;
      case "PAUSE":
        this.writeWorkLog(user.id, workId, "PAUSED_WORK");
        break;
      case "IN_PROGRESS":
        this.writeWorkLog(user.id, workId, "CONTINUE_WORK");
        break;
      case "PENDING":
        this.writeWorkLog(user.id, workId, "REQUEST_TO_COMPLETED");
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
  deleteWorkRequest: async (workRequestId) => {
    await db.workRequest.delete({
      where: {
        id: workRequestId,
      },
    });
  },
};
