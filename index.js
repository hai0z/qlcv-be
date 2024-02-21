const express = require("express");
const cookieParser = require("cookie-parser");
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

app.get("/", (req, res) => {
  res.json({ message: "Hello World!" });
});

app.use(
  "/work",
  [require("./middlewares/auth.middleware")],
  require("./routes/work.route")
);

app.use("/auth", require("./routes/auth.route"));

app.use(
  "/comment",
  [require("./middlewares/auth.middleware")],
  require("./routes/comment.route")
);

app.listen(3000, () => {
  console.log("server is running on http://localhost:3000");
});
