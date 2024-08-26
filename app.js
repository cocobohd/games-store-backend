const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

const authRouter = require("./routes/api/auth.router");

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRouter);

app.use((err, req, res, next) => {
  const { status = 500, message = "Server error" } = err;
  res.status(status).json({ message });
});

module.exports = app;
