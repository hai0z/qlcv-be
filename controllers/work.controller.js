const workService = require("../services/work.service");

module.exports = {
  //get
  getAllWork: async (req, res) => {
    const user = req.cookies.user;
    const { page } = req.query || 1;
    const data = await workService.getAllWork(user, page);
    res.status(200).json(data);
  },
  getTodayWork: async (req, res) => {
    const user = req.cookies.user;
    const data = await workService.getTodayWork(user);
    res.status(200).json(data);
  },
  getWorkById: async (req, res) => {
    const { id } = req.params;
    const user = req.cookies.user;
    try {
      const data = await workService.getWorkById(id, user);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getWorkLog: async (req, res) => {
    const { id } = req.params;
    const data = await workService.getWorkLog(id);
    res.status(200).json(data);
  },

  //post
  createWork: async (req, res) => {
    const user = req.cookies.user;
    const { work } = req.body;
    const data = await workService.createWork(work, user);
    res.status(200).json(data);
  },
  acceptWork: async (req, res) => {
    const user = req.cookies.user;
    const { id } = req.params;
    const data = await workService.acceptWork(id, user);
    res.status(200).json(data);
  },
  declineWork: async (req, res) => {
    const user = req.cookies.user;
    const { id } = req.params;
    const data = await workService.declineWork(id, user);
    res.status(200).json(data);
  },

  //put
  updateWork: async (req, res) => {
    const { id } = req.params;
    const { work } = req.body;
    await workService.updateWork(id, work);
    res.status(200).json({ message: "Work updated successfully" });
  },
  updateWorkStatus: async (req, res) => {
    const user = req.cookies.user;
    const { id } = req.params;
    const { status } = req.body;
    await workService.updateWorkStatus(id, status, user);
    res.status(200).json({ message: "Work status updated successfully" });
  },
  updateWorkView: async (req, res) => {
    const { id } = req.params;
    await workService.updateWorkView(id);
    res.status(200).json({ message: "Work view updated successfully" });
  },

  //delete
  deleteWork: async (req, res) => {
    const { id } = req.params;
    try {
      await workService.deleteWork(id);
      res.status(200).json({ message: "Work deleted successfully" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};
