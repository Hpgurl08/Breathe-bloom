const jwt = require("jsonwebtoken");

const { LocalStorage } = require("node-localstorage");
const localStorage = new LocalStorage("./storage");

// const tokenx = localStorage.getItem("AUTH_TOKEN");

const authenticateToken = (req, res, next) => {
  const tokenx = localStorage.getItem("AUTH_TOKEN");
  const token = tokenx;
  //console.log('Header token here ',token)
  if (!token) return res.redirect("/");
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.redirect("/");
  }
};

module.exports = authenticateToken;
