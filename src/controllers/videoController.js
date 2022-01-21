let videos = [
  {
    id: 0,
    title: "First Video",
    rating: 4.2,
    comments: 3,
    createdAt: "2 minutes ago",
    views: 1,
  },
  {
    id: 1,
    title: "Second Video",
    rating: 5.0,
    comments: 7,
    createdAt: "15 minutes ago",
    views: 38,
  },
  {
    id: 2,
    title: "Third Video",
    rating: 2.2,
    comments: 3,
    createdAt: "28 minutes ago",
    views: 76,
  },
];

export const trendy = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });
export const watch = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  return res.render("watchvideo", {
    pageTitle: `Watching: ${video.title}`,
    video,
  });
};
export const getEdit = (req, res) => {
  const { id } = req.params;
  const video = videos[id];
  return res.render("editvideo", {
    pageTitle: `Editing: ${video.title}`,
    video,
  });
};
export const postEdit = (req, res) => {
  const { id } = req.params;
  const { title } = req.body;
  videos[id].title = title;
  return res.redirect(`/videos/${id}`);
};
export const getUpload = (req, res) => {
  return res.render("upload", { pageTitle: "Upload Video" });
};
export const postUpload = (req, res) => {
  // add a new video on videos array
  const { title } = req.body;
  const newVideo = {
    id: videos.length,
    title: title,
    rating: Math.floor(Math.random() * 5),
    comments: 0,
    createdAt: "Just Now",
    views: 1,
  };
  videos.push(newVideo);
  return res.redirect("/");
};

export const search = (req, res) => res.send("Search Videos");
export const remove = (req, res) => res.send("remove video");
