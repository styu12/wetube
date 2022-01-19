import express from "express";
import { join, login } from "../controllers/userController.js";
import { search, trendy } from "../controllers/videoController.js";

const globalRouter = express.Router();

globalRouter.get("/", trendy);
globalRouter.get("/join", join);
globalRouter.get("/login", login);
globalRouter.get("/search", search);

export default globalRouter;
