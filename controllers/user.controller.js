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
};
