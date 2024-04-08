const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const COOKIE_AGE = 30 * 24 * 60 * 60 * 1000;
module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    try {
      const data = await authService.login(email, password);
      const { avatar, ...rest } = data;
      if (data) {
        const token = jwt.sign(
          {
            data: rest,
          },
          process.env.JWT_SECRET,
          { expiresIn: "30d" }
        );
        res.cookie("token", token, {
          httpOnly: true,
          maxAge: COOKIE_AGE,
        });
        res.status(200).json({
          message: "Login successfully",
          data,
          token: token,
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  logOut: async (_req, res) => {
    res.clearCookie("token");
    res.status(200).json({ message: "Logout successfully" });
  },

  register: async (req, res) => {
    const { email, password, confirmPassword } = req.body;
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }
    try {
      const data = await authService.register(email, password);
      const { password: _password, ...rest } = data;
      res.status(200).json({
        message: "Register successfully",
        data: rest,
      });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  verifyToken: async (req, res) => {
    try {
      const token = req.cookies.token;
      const data = await authService.verifyToken(token);
      res.status(200).json({ message: "Token verified", data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
