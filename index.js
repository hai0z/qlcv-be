const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth.middleware");
const cors = require("cors");

const app = express();

app.use(
  cors({
    credentials: true,
    origin: "http://localhost:8080",
  })
);
app.use(
  express.json({
    limit: "50mb",
  })
);
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.get("/", (_, res) => {
  res.json({ message: "Hello" });
});

app.use("/work", authMiddleware, require("./routes/work.route"));
app.use(
  "/notification",
  authMiddleware,
  require("./routes/notification.route")
);
app.use("/auth", require("./routes/auth.route"));

app.use("/comment", authMiddleware, require("./routes/comment.route"));

app.use("/user", authMiddleware, require("./routes/user.route"));

app.use("/stats", authMiddleware, require("./routes/stats.route"));

app.use("/search", authMiddleware, require("./routes/search.route"));

app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
