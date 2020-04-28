const jwt = require("jsonwebtoken");
require("dotenv").config();

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

const auth = (req, res, next) => {
  try {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ").pop();
    if (!token) return res.status(401).send("no token");
    const decoded = jwt.verify(token, accessTokenSecret);
    req.body.username = decoded.username;
    next();
  } catch (error) {
    res.sendStatus(403);
  }
};
module.exports = { auth };
