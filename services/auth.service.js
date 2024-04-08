const prisma = require("@prisma/client");
const jwt = require("jsonwebtoken");
const db = new prisma.PrismaClient();
const dotenv = require("dotenv");
const md5 = require("md5");

dotenv.config();

module.exports = {
  login: async (email, password) => {
    const data = await db.user.findUnique({
      where: {
        email,
        password: md5(password),
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        avatar: true,
      },
    });
    if (data) {
      return data;
    } else {
      throw new Error("Invalid email or password");
    }
  },
  register: async (email, password) => {
    try {
      const data = await db.user.create({
        data: {
          email,
          password,
          address: "",
          name: email.split("@")[0],
        },
      });
      return data;
    } catch (error) {
      throw new Error("Email already exists");
    }
  },
  verifyToken: async (token) => {
    if (!token) {
      throw new Error("Token not found");
    }
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return decoded.data;
    } catch (error) {
      throw new Error("Invalid token");
    }
  },
};
