const authService = require("../services/auth.service");
const jwt = require("jsonwebtoken");

module.exports = {
  login: async (req, res) => {
    const { email, password } = req.body;
    const data = await authService.login(email, password);
    if (data) {
      const token = jwt.sign(
        {
          data,
        },
        "secret",
        { expiresIn: "30d" }
      );
      res.cookie("user", data);
      res.cookie("token", token);
      res.status(200).json({
        message: "Login successfully",
        data: data,
        token: token,
      });
    } else {
      res.status(400).json({ message: "Invalid email or password" });
    }
  },

  logOut: async (_req, res) => {
    res.clearCookie("user");
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
};
