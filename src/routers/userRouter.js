import express from "express";
import {
  edit,
  remove,
  logout,
  see,
  githubLoginStart,
  githubLoginEnd,
} from "../controllers/userController.js";

const userRouter = express.Router();

userRouter.get("/github", githubLoginStart);
userRouter.get("/github/callback", githubLoginEnd);
userRouter.get("/logout", logout);
userRouter.get("/edit", edit);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);

export default userRouter;
