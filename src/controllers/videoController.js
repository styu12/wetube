const videos = [
  {
    id: 1,
    title: "First Video",
    rating: 4.2,
    comments: 3,
    createdAt: "2 minutes ago",
    views: 38,
  },
  {
    id: 2,
    title: "Second Video",
    rating: 5.0,
    comments: 7,
    createdAt: "15 minutes ago",
    views: 38,
  },
  {
    id: 3,
    title: "Third Video",
    rating: 2.2,
    comments: 3,
    createdAt: "28 minutes ago",
    views: 76,
  },
];

export const trendy = (req, res) =>
  res.render("home", { pageTitle: "Home", videos });
export const see = (req, res) => res.render("seevideo", { pageTitle: "Watch" });
export const edit = (req, res) =>
  res.send("Edit My Videos", { pageTitle: "Edit" });
export const search = (req, res) => res.send("Search Videos");
export const remove = (req, res) => res.send("remove video");
export const upload = (req, res) => res.send("upload video");
