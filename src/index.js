const express = require("express");
const morgan = require("morgan");

const PORT = 4000;
const app = express();

const logger = morgan("dev");

const home = (req, res) => {
  return res.send("home");
};
const login = (req, res) => {
  return res.send("login");
};

app.use(logger);
app.get("/", home);
app.get("/login", login);

const listenHandler = () =>
  console.log(`Server listening on port http://localhost:${PORT} 🎇`);

app.listen(PORT, listenHandler);
