const searchService = require("../services/search.service");

module.exports = {
  search: async (req, res) => {
    const user = req.user;
    const { q } = req.query;
    const result = await searchService.search(q, user);
    res.status(200).json(result);
  },
};
