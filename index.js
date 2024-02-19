const express = require("express");
const cookieParser = require("cookie-parser");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

app.use("/work", require("./routes/work.route"));
app.use("/auth", require("./routes/auth.route"));

app.listen(3000, () => {
  console.log("Example app listening on port 3000!");
});
