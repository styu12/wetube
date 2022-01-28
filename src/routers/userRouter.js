import express from "express";
import {
  remove,
  logout,
  see,
  githubLoginStart,
  githubLoginEnd,
  getEdit,
  postEdit,
  getChangePassword,
  postChangePassword,
} from "../controllers/userController.js";
import {
  publicOnlyMiddleware,
  userOnlyMiddleware,
  avatarUpload,
} from "../middlewares.js";

const userRouter = express.Router();

userRouter.get("/github", publicOnlyMiddleware, githubLoginStart);
userRouter.get("/github/callback", publicOnlyMiddleware, githubLoginEnd);
userRouter.get("/logout", userOnlyMiddleware, logout);
userRouter
  .route("/edit")
  .all(userOnlyMiddleware)
  .get(getEdit)
  .post(avatarUpload.single("avatar"), postEdit);
userRouter
  .route("/changePassword")
  .all(userOnlyMiddleware)
  .get(getChangePassword)
  .post(postChangePassword);
userRouter.get("/remove", remove);
userRouter.get("/:id", see);

export default userRouter;
