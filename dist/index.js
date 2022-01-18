"use strict";

var express = require("express");

var PORT = 4000;
var app = express();

var handleHome = function handleHome(req, res) {
  return res.send("My First Request!");
};

app.get("/", handleHome);

var listenHandler = function listenHandler() {
  return console.log("Server listening on port http://localhost:".concat(PORT, " \uD83C\uDF87"));
};

app.listen(PORT, listenHandler);