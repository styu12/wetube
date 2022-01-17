"use strict";

var _express = _interopRequireDefault(require("express"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

var PORT = 4000;
var app = (0, _express["default"])();

var listenHandler = function listenHandler() {
  return console.log("Server listening on port http://localhost:".concat(PORT, " \uD83C\uDF87"));
};

app.listen(PORT, listenHandler);