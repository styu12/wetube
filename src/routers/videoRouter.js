import express from "express";
import { edit, see, upload, remove } from "../controllers/videoController.js";

const videoRouter = express.Router();

videoRouter.get("/upload", upload);
videoRouter.get("/:id(\\d+)", see);
videoRouter.get("/:id(\\d+)/edit", edit);
videoRouter.get("/:id(\\d+)/remove", remove);

export default videoRouter;
