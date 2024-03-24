const notificationService = require("../services/notification.service");

module.exports = {
  getAllNotification: async (req, res) => {
    const user = req.user;
    try {
      const data = await notificationService.getAllNotification(user);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  createNotification: async (req, res) => {
    const { receiverId, message } = req.body;
    const senderId = req.user.id;
    try {
      await notificationService.createNotification(
        senderId,
        receiverId,
        message
      );
      res.status(200).json({ message: "Notification created successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  updateNotification: async (req, res) => {
    const { id } = req.params;
    try {
      const data = await notificationService.updateNotification(id);
      res.status(200).json({ message: data });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
