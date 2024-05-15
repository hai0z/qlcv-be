const { PrismaClient } = require("@prisma/client");

const db = new PrismaClient();

const md5 = require("md5");

module.exports = {
  getUsers: async () => {
    try {
      const users = await db.user.findMany({
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          email: true,
          address: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return users;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  getUserById: async (id) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          avatar: true,
          role: true,
          email: true,
          address: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
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
    const { email, phone, password } = data;
    try {
      const checkEmail = await db.user.findUnique({
        where: {
          email,
        },
      });
      if (checkEmail) {
        throw new Error("Email already exists");
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
          password: md5(1111),
        },
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  updateUser: async (userId, data) => {
    const { id, ...other } = data;
    try {
      const user = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          ...other,
        },
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  deleteUser: async (userId) => {
    try {
      const user = await db.user.delete({
        where: {
          id: userId,
        },
      });

      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  changePassword: async (userId, currentPassword, newPassword) => {
    try {
      const user = await db.user.findUnique({
        where: {
          id: userId,
          password: md5(currentPassword),
        },
      });
      if (!user) {
        throw new Error("Mật khẩu hiện tại không đúng");
      }
      await db.user.update({
        where: {
          id: userId,
        },
        data: {
          password: md5(newPassword),
        },
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
  resetPassword: async (userId) => {
    try {
      const user = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          password: md5("1111"),
        },
      });
      return user;
    } catch (error) {
      throw new Error(error.message);
    }
  },
};
