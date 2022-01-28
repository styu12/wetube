import express from "express";
import {
  watch,
  deleteVideo,
  getEdit,
  postEdit,
  getUpload,
  postUpload,
} from "../controllers/videoController.js";
import { userOnlyMiddleware, videoUpload } from "../middlewares.js";

const videoRouter = express.Router();

videoRouter
  .route("/upload")
  .all(userOnlyMiddleware)
  .get(getUpload)
  .post(videoUpload.single("video"), postUpload);
videoRouter.get("/:id([0-9a-f]{24})", watch);
videoRouter
  .route("/:id([0-9a-f]{24})/edit")
  .all(userOnlyMiddleware)
  .get(getEdit)
  .post(postEdit);
videoRouter.get("/:id([0-9a-f]{24})/delete", userOnlyMiddleware, deleteVideo);

export default videoRouter;
