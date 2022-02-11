import "dotenv/config";
import "regenerator-runtime/runtime.js";
import "./db.js";
import "./models/Video.js";
import "./models/User.js";
import "./models/Comment.js";
import app from "./server.js";

const PORT = 4000;
const listenHandler = () =>
  console.log(`✅Server listening on port http://localhost:${PORT} 🎇`);

app.listen(PORT, listenHandler);
