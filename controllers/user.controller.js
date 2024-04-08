const userService = require("../services/user.service");

module.exports = {
  getUsers: async (_, res) => {
    try {
      const users = await userService.getUsers();
      res.status(200).json(users);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getUserById: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userService.getUserById(id);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  createUser: async (req, res) => {
    const { data } = req.body;

    try {
      const user = await userService.createUser({
        ...data,
        password: "123456",
      });
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateUser: async (req, res) => {
    const { id } = req.params;
    const { data } = req.body;
    try {
      const user = await userService.updateUser(id, data);
      res.status(200).json(user);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  deleteUser: async (req, res) => {
    const { id } = req.params;
    try {
      await userService.deleteUser(id);
      res.status(200).json("User deleted successfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  changePassword: async (req, res) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;
    try {
      await userService.changePassword(id, currentPassword, newPassword);
      res.status(200).json("Password changed successfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  resetPassword: async (req, res) => {
    const { id } = req.params;
    try {
      const user = await userService.resetPassword(id);
      res.status(200).json("Password reset successfully");
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
