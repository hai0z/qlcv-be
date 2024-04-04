const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

module.exports = {
  getUsers: async () => {
    try {
      const users = await db.user.findMany();
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getUserByEmail: async (email) => {
    try {
      const user = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (!user) {
        throw new Error("User not found");
      }
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  createUser: async (data) => {
    const { email, password, name, address, phone } = data;
    try {
      const checkEmail = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (checkEmail) {
        throw new Error("User already exists");
      }
      const checkPhone = await db.user.findUnique({
        where: {
          phone,
        },
      });
      if (checkPhone) {
        throw new Error("Phone already exists");
      }

      const user = await db.user.create({
        data: {
          ...data,
        },
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
