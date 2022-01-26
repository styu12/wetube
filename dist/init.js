"use strict";

require("dotenv/config");

require("./db.js");

require("./models/Video.js");

require("./models/User.js");

var _server = _interopRequireDefault(require("./server.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 4000;

var listenHandler = function listenHandler() {
  return console.log("\u2705Server listening on port http://localhost:".concat(PORT, " \uD83C\uDF87"));
};

_server["default"].listen(PORT, listenHandler);