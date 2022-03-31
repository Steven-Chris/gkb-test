const express = require("express");
const app = express();
var bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
require("./config/mongoose");
app.use(express.json());
const port = process.env.PORT;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));

const userRoutes = require("./api/routes/userRoutes");
const refreshTokenRoutes = require("./api/routes/refreshToken");
app.use("/user", userRoutes);
app.use("/auth", refreshTokenRoutes);

app.listen(port, () => {
  console.log(`App listening on port ${port}!`);
});
