const express = require("express");
const Pool = require("pg").Pool;
require("dotenv").config();
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const organisationRoutes = require("./routes/organisationRoutes");
const dbPool = require("./db");

// console.log("dbPool", dbPool);

const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use("/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", organisationRoutes);

app.get("/", (req, res) => {
  res.json("Welcome, Postgres");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is listening at port ${PORT}`);
});
