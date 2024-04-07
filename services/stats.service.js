const prisma = require("@prisma/client");
const dayjs = require("dayjs");

const db = new prisma.PrismaClient();

module.exports = {
  getStats: async (startTime, endTime) => {
    const daySelectedStart = dayjs(startTime).startOf("day").toDate();
    const daySelectedEnd = dayjs(endTime).endOf("day").toDate();
    try {
      const stats = await db.user.findMany({
        select: {
          avatar: true,
          name: true,
          id: true,
          email: true,
          WorkImplementer: {
            include: {
              Work: {
                include: {
                  implementer: {
                    include: {
                      request: true,
                    },
                  },
                },
                where: {
                  OR: [
                    {
                      // startTime nằm trong khoảng thời gian bạn chọn
                      startTime: {
                        gte: daySelectedStart,
                        lte: daySelectedEnd,
                      },
                    },
                    {
                      // endTime nằm trong khoảng thời gian bạn chọn
                      endTime: {
                        gte: daySelectedStart,
                        lte: daySelectedEnd,
                      },
                    },
                    {
                      // Cả startTime và endTime đều bao gồm khoảng thời gian bạn chọn
                      AND: [
                        {
                          startTime: {
                            lte: daySelectedStart,
                          },
                        },
                        {
                          endTime: {
                            gte: daySelectedEnd,
                          },
                        },
                      ],
                    },
                  ],
                },
              },
            },
          },
        },
      });

      return stats.map((user) => ({
        ...user,
        WorkImplementer: user.WorkImplementer.filter(
          (work) => work.Work !== null
        ),
        totalWork: user.WorkImplementer.filter((work) => work.Work !== null)
          .length,
        totalCompleted: user.WorkImplementer.filter(
          (work) => work.Work && work.Work.status === "COMPLETED"
        ).length,
      }));
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
