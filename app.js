require("dotenv").config();
const express = require("express");
const expressLayout = require("express-ejs-layouts");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const session = require("express-session");

const dbConnection = require("./server/db/database");

dbConnection();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret:
      process.env.JWT_SECRET ||
      "Kshshshsh77226262266226yh73633h3y36363yryr83883838383883883",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);

app.use(express.static("public"));

app.use(expressLayout);

app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

app.use("/", require("./server/routes/users"));
app.use("/", require("./server/routes/home"));
app.use("/", require("./server/routes/journal"));
app.use("/", require("./server/routes/resource"));
app.use("/", require("./server/routes/forum"));

app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
