const workService = require("../services/work.service");

module.exports = {
  //get
  getAllWork: async (req, res) => {
    const user = req.user;
    let { page, limit } = req.query;
    if (!page) page = 1;
    if (!limit) limit = 5;
    const data = await workService.getAllWork(
      user,
      Number(page),
      Number(limit)
    );
    res.status(200).json(data);
  },
  getTodayWork: async (req, res) => {
    const user = req.user;
    const data = await workService.getTodayWork(user);
    res.status(200).json(data);
  },
  getWorkById: async (req, res) => {
    const { id } = req.params;
    const user = req.user;
    try {
      const data = await workService.getWorkById(id, user);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  getWorkCalender: async (req, res) => {
    const user = req.user;
    const data = await workService.getWorkCalender(user);
    res.status(200).json(data);
  },
  getWorkLog: async (req, res) => {
    const { id } = req.params;
    const data = await workService.getWorkLog(id);
    res.status(200).json(data);
  },

  //post
  createWork: async (req, res) => {
    const user = req.user;
    const { work } = req.body;
    const data = await workService.createWork(work, user);
    res.status(200).json(data);
  },
  acceptWork: async (req, res) => {
    const user = req.user;
    const { id } = req.body;
    const data = await workService.acceptWork(id, user);
    res.status(200).json(data);
  },
  declineWork: async (req, res) => {
    const user = req.user;
    const { id } = req.body;
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
    const user = req.user;
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
