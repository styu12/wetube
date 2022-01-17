const express = require("express");

const PORT = 4000;
const app = express();

app.get("/", () => console.log("Somebody is trying to go home!"));

const listenHandler = () =>
  console.log(`Server listening on port http://localhost:${PORT} 🎇`);

app.listen(PORT, listenHandler);
