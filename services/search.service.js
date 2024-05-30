const prisma = require("@prisma/client");

const db = new prisma.PrismaClient();

const stringToSlug = require("../utils/slug");

module.exports = {
  search: async (key, user) => {
    try {
      if (user.role === "ADMIN") {
        const result = await db.work.findMany({});
        return result.filter((work) => {
          return stringToSlug(work.title).includes(stringToSlug(key));
        });
      } else {
        const result = await db.user.findMany({
          where: {
            Work: {
              some: {
                implementer: {
                  some: {
                    userId: user.id,
                  },
                },
              },
            },
          },
          include: {
            Work: {
              where: {
                implementer: {
                  some: {
                    userId: user.id,
                  },
                },
              },
            },
          },
        });
        const resultArray = [];
        result.map((user) => {
          user.Work.map((work) => {
            resultArray.push(work);
          });
        });
        return resultArray.filter((work) => {
          return stringToSlug(work.title).includes(stringToSlug(key));
        });
      }
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
