const express = require("express");
const jwt = require("jsonwebtoken"); //jsonwebtoken
const { users } = require("./store");
require("dotenv").config();

const app = express();
app.use(express.json());

// secrets
const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET;
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;
let storageRefreshTOken = [];

const genAccessToken = (payload) =>
  jwt.sign(payload, accessTokenSecret, { expiresIn: "25s" });
const genRefreshToken = (payload) => jwt.sign(payload, refreshTokenSecret);

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [user] = users.filter((data) => data.email === email);
  if (!user) return res.sendStatus(404);
  const accessToken = genAccessToken(user);
  const refreshToken = genRefreshToken({ name: user.username });

  // add refresh token to storage
  storageRefreshTOken.push(refreshToken);
  res.send({
    accessToken,
    refreshToken,
    email,
  });
});

app.post("/token", (req, res) => {
  const { token } = req.body;
  if (!token) return res.sendStatus(401);
  if (!storageRefreshTOken.includes(token)) return res.sendStatus(403);
  try {
    const resp = jwt.verify(token, refreshTokenSecret);
    const accessToken = genAccessToken({ name: resp.name });
    res.send({
      accessToken,
    });
  } catch (error) {
    return res.sendStatus(403);
  }
});

app.delete("/logout", (req, res) => {
  const { token } = req.body;
  if (!token) return res.send("no token provided");
  storageRefreshTOken = storageRefreshTOken.filter((token) => token !== token);
  res.sendStatus(200);
});

app.listen(4000, () => console.log(`running on ${4000}`));
