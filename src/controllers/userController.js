import User from "../models/User.js";
import bcrypt from "bcrypt";

export const getJoin = (req, res) => {
  return res.render("join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { email, password, password2, username, name, location } = req.body;

  if (password !== password2) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "Check again your password!",
    });
  }

  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This email already exists!",
    });
  }

  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("join", {
      pageTitle: "Join",
      errorMessage: "This username already exists!",
    });
  }

  try {
    await User.create({
      email,
      password,
      username,
      name,
      location,
    });
    return res.redirect("/login");
  } catch (error) {
    return res.render("join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "An account with that username does not exist!",
    });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(400).render("login", {
      pageTitle: "Login",
      errorMessage: "Wrong Password!",
    });
  }
  console.log("Login Succeed!! Now let's study Cookie and Session!");
  return res.redirect("/");
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
