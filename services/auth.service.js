const prisma = require("@prisma/client");

const db = new prisma.PrismaClient();

module.exports = {
  login: async (email, password) => {
    const data = await db.user.findUnique({
      where: {
        email,
        password,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    });
    return data;
  },
  register: async (email, password) => {
    try {
      const data = await db.user.create({
        data: {
          email,
          password,
          address: "",
        },
      });
      return data;
    } catch (error) {
      throw new Error("Email already exists");
    }
  },
};
