const notificationService = require("../services/notification.service");
const { workService, writeWorkLog } = require("../services/work.service");

module.exports = {
  //get
  getAllWork: async (req, res) => {
    const user = req.user;
    console.log(user);
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
  getWorkCalendar: async (req, res) => {
    const user = req.user;
    const data = await workService.getWorkCalendar(user);
    res.status(200).json(data);
  },
  getProgressChart: async (req, res) => {
    const user = req.user;
    console.log(user);
    try {
      const data = await workService.getProgressChart(user);
      res.status(200).json(data);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  //post
  createWork: async (req, res) => {
    const user = req.user;
    const { data } = req.body;
    try {
      const result = await workService.createWork(data, user);
      res.status(200).json(result);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  acceptWork: async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const data = await workService.acceptWork(id, user);

    res.status(200).json(data);
  },
  declineWork: async (req, res) => {
    const user = req.user;
    const { id } = req.params;
    const data = await workService.declineWork(id, user);
    res.status(200).json(data);
  },
  addMember: async (req, res) => {
    const { userId } = req.body;
    console.log({ userId });
    const { id: workId } = req.params;
    const user = req.user;
    try {
      await workService.addMemberToWork(workId, userId);
      await notificationService.createNotification(
        user.id,
        userId,
        workId,
        "đã thêm bạn vào một công việc"
      );
      res.status(200).json({ message: "Member added successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  removeMember: async (req, res) => {
    const { userId } = req.body;
    const { id: workId } = req.params;
    const user = req.user;
    console.log(id, userId);
    try {
      await workService.removeMemberToWork(id, userId);
      await notificationService.createNotification(
        user.id,
        userId,
        workId,
        "đã xoá bạn khỏi một công việc"
      );
      res.status(200).json({ message: "Member removed successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  createWorkRequest: async (req, res) => {
    const user = req.user;
    const { title, workImplementerId, userId } = req.body;
    const { id: workId } = req.params;
    try {
      await workService.createWorkRequest(title, workImplementerId, userId);
      await writeWorkLog(user.id, workId, "ADD_WORK_REQUEST");
      await notificationService.createNotification(
        user.id,
        userId,
        workId,
        "đã thêm 1 yêu cầu công việc dành cho bạn"
      );
      res.status(200).json({ message: "Work request created successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
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
    try {
      await workService.updateWorkStatus(id, status, user);
      console.log("Work status updated successfully");
      res.status(200).json({ message: "Work status updated successfully" });
    } catch (error) {
      console.log(error);
      res.status(400).json({ message: error.message });
    }
  },
  updateWorkView: async (req, res) => {
    const { id } = req.params;
    await workService.updateWorkView(id);
    res.status(200).json({ message: "Work view updated successfully" });
  },
  updateWorkRequest: async (req, res) => {
    const user = req.user;
    const { data, workRequestId } = req.body;
    const { id: workId } = req.params;
    try {
      await workService.updateWorkRequest(workRequestId, data, user);
      if (data.isCompleted) {
        await writeWorkLog(user.id, workId, "COMPLETED_WORK_REQUEST");
      }
      res.status(200).json({ message: "Work request update successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },

  //delete
  deleteWork: async (req, res) => {
    const { id } = req.params;
    try {
      await workService.deleteWork(id);
      res.status(200).json({ message: "Work deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
  deleteWorkRequest: async (req, res) => {
    const { workRequestId } = req.params;
    try {
      await workService.deleteWorkRequest(workRequestId);
      res.status(200).json({ message: "Work request deleted successfully" });
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  },
};
