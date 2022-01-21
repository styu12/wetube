"use strict";

var _express = _interopRequireDefault(require("express"));

var _morgan = _interopRequireDefault(require("morgan"));

var _globalRouter = _interopRequireDefault(require("./routers/globalRouter.js"));

var _userRouter = _interopRequireDefault(require("./routers/userRouter.js"));

var _videoRouter = _interopRequireDefault(require("./routers/videoRouter.js"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 4000;
var app = (0, _express["default"])();
var logger = (0, _morgan["default"])("dev");
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);
app.use(_express["default"].urlencoded({
  extended: true
}));
app.use("/", _globalRouter["default"]);
app.use("/users", _userRouter["default"]);
app.use("/videos", _videoRouter["default"]);

var listenHandler = function listenHandler() {
  return console.log("Server listening on port http://localhost:".concat(PORT, " \uD83C\uDF87"));
};

app.listen(PORT, listenHandler);