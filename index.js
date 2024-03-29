const express = require("express");
const cookieParser = require("cookie-parser");
const authMiddleware = require("./middlewares/auth.middleware");
const cors = require("cors");

const app = express();

app.use(
  cors({
    origin: "http://localhost:8080",
    credentials: true,
  })
);
app.use(express.json());
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

app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
