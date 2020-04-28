const express = require("express");
const jwt = require("jsonwebtoken"); //jsonwebtoken
const { users, posts } = require("./store");
const { auth } = require("./auth");
require("dotenv").config();

const app = express();
app.use(express.json());

const accessTokenSecret = process.env.ACCESS_TOKEN_SECRET
const refreshTokenSecret = process.env.REFRESH_TOKEN_SECRET;

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const [user] = users.filter((data) => data.email === email);
  if (!user) return res.sendStatus(404);
  const accessToken = jwt.sign(user, accessTokenSecret);
  res.send({
    accessToken,
    email,
  });
});

app.post("/post", auth, (req, res) => {
  console.log(req.body)
  const { username, title } = req.body;
  posts.push({ username, title });
  res.send(posts.filter(onwer => username === onwer.username));
});

app.get("/post",auth, (req, res) => {
  const { username } = req.body
  const userPosts = posts.filter(onwer => username === onwer.username)
  res.status(200).send({ data: userPosts });
});

app.listen(3000, () => console.log(`running on ${3000}`));

module.exports = { accessTokenSecret};
