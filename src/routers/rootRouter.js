import express from "express";
import { getJoin, postJoin, login } from "../controllers/userController.js";
import { search, home } from "../controllers/videoController.js";

const rootRouter = express.Router();

rootRouter.get("/", home);
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.get("/login", login);
rootRouter.get("/search", search);

export default rootRouter;
