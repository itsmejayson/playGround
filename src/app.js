const express = require("express");
const userRoutes = require("./routes/user.routes");

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  console.log("🔥 REQUEST HIT EXPRESS:", req.method, req.url);
  next();
});

app.use("/users", userRoutes);

module.exports = app;