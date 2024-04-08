const userService = require("../services/user.service");

const requireAdmin = async (req, res, next) => {
  const user = req.user;
  const userRole = (await userService.getUserById(user.id)).role;
  console.log(userRole);
  if (!user || !userRole) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  if (userRole !== "ADMIN") {
    return res
      .status(403)
      .json({ message: "Permission denied you are not an admin" });
  }
  next();
};

module.exports = requireAdmin;
