const statsService = require("../services/stats.service");

module.exports = {
  getStats: async (req, res) => {
    const { startTime, endTime } = req.query;
    console.log({ startTime, endTime });
    const stats = await statsService.getStats(startTime, endTime);
    res.status(200).json(stats);
  },
};
