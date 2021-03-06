import User from "../models/User.js";
import Video from "../models/Video.js";
import Comment from "../models/Comment.js";

export const home = async (req, res) => {
  const { hashtag } = req.query;
  let videos = [];

  const allVideos = await Video.find({})
  .populate("owner")
  .sort({ createdAt: "desc" });

  if (hashtag && hashtag != "ALL") {
    videos = await Video.find({ 
      hashtags: hashtag
     })
    .populate("owner")
    .sort({ createdAt: "desc" });
  } else {
    videos = allVideos;
  }
  return res.render("home", { pageTitle: "Home", videos, allVideos });
};
export const watch = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id).populate("owner").populate("comments");
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  return res.render("watchvideo", {
    pageTitle: video.title,
    video,
  });
};
export const getEdit = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not owner of the video.");
    return res.status(403).redirect("/");
  }
  return res.render("editvideo", {
    pageTitle: `Editing: ${video.title}`,
    video,
  });
};
export const postEdit = async (req, res) => {
  const { id } = req.params;
  const { title, description, hashtags } = req.body;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not owner of the video.");
    return res.status(403).redirect("/");
  }
  await Video.findByIdAndUpdate(id, {
    title,
    description,
    hashtags: Video.formatHashtags(hashtags),
  });
  req.flash("success", "Edit Success!");
  return res.redirect(`/videos/${id}`);
};

export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = async (req, res) => {
  console.log(req.files);

  const {
    session: {
      user: { _id },
    },
    files: { video, thumb },
    body: { title, description, hashtags },
  } = req;
  try {
    const isHeroku = process.env.NODE_ENV === "production";
    const newVideo = await Video.create({
      title,
      fileUrl: isHeroku ? video[0].location : `/${video[0].path}`,
      thumbUrl: isHeroku ? thumb[0].location : `/${thumb[0].path}`,
      description,
      hashtags: Video.formatHashtags(hashtags),
      owner: _id,
    });
    const owner = await User.findById(_id);
    owner.videos.push(newVideo._id);
    await owner.save();
    req.flash("success", "Upload Success!");
    return res.redirect("/");
  } catch (error) {
    console.log(error);
    return res.render("upload", {
      pageTitle: "Upload Video",
      errorMessage: error._message,
    });
  }
};

export const search = async (req, res) => {
  const { keyword } = req.query;
  let videos = [];
  if (keyword) {
    videos = await Video.find({
      title: {
        $regex: new RegExp(keyword, "i"),
      },
    });
  }
  return res.render("search", { pageTitle: "Search Videos", videos });
};

export const deleteVideo = async (req, res) => {
  const { id } = req.params;
  const {
    user: { _id },
  } = req.session;
  const video = await Video.findById(id);
  if (!video) {
    return res.status(404).render("404", { pageTitle: "Video Not Found." });
  }
  if (String(video.owner) !== String(_id)) {
    req.flash("error", "You are not owner of the video.");
    return res.status(403).redirect("/");
  }
  const owner = await User.findById(_id);
  owner.videos.splice(owner.videos.indexOf(video._id), 1);

  await Video.findByIdAndDelete(id);
  await owner.save();
  req.flash("success", "Delete Success!");
  return res.redirect("/");
};

export const registerView = async (req, res) => {
  const { id } = req.params;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  video.meta.views += 1;
  await video.save();
  return res.sendStatus(200);
};

export const addComment = async (req, res) => {
  const {
    params: { id },
    body: { text },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    return res.sendStatus(404);
  }
  const newComment = await Comment.create({
    text,
    author: user._id,
    video: id,
  });
  video.comments.push(newComment._id);
  await video.save();
  return res.status(201).json({ commentId: newComment._id });
};

export const deleteComment = async (req, res) => {
  const {
    params: { id, commentId },
    session: { user },
  } = req;
  const video = await Video.findById(id);
  if (!video) {
    req.flash("error", "Can't find video of that comment.");
    return res.sendStatus(404);
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    req.flash("error", "Can't find that comment.");
    return res.sendStatus(404);
  }

  if (String(comment.author) !== String(user._id)) {
    req.flash("error", "You are not author of that comment.");
    return res.sendStatus(403);
  }

  await Comment.findByIdAndDelete(commentId);
  video.comments.splice(video.comments.indexOf(commentId), 1);
  await video.save();
  return res.sendStatus(201);
};
