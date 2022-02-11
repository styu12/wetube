import User from "../models/User.js";
import bcrypt from "bcrypt";
import fetch from "node-fetch";
import Video from "../models/Video.js";

export const getJoin = (req, res) => {
  return res.render("users/join", { pageTitle: "Join" });
};
export const postJoin = async (req, res) => {
  const { email, password, password2, username, name, location } = req.body;

  if (password !== password2) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: "Check again your password!",
    });
  }

  const emailExists = await User.exists({ email });
  if (emailExists) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: "This email already exists!",
    });
  }

  const usernameExists = await User.exists({ username });
  if (usernameExists) {
    return res.status(400).render("users/join", {
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
    req.flash("success", "Join Success!");
    return res.redirect("/login");
  } catch (error) {
    return res.status(400).render("users/join", {
      pageTitle: "Join",
      errorMessage: error._message,
    });
  }
};

export const getLogin = (req, res) => {
  return res.render("users/login", { pageTitle: "Login" });
};
export const postLogin = async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username, socialOnly: false });
  if (!user) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMessage: "An account with that username does not exist!",
    });
  }

  const ok = await bcrypt.compare(password, user.password);

  if (!ok) {
    return res.status(400).render("users/login", {
      pageTitle: "Login",
      errorMessage: "Wrong Password!",
    });
  }

  req.session.loggedIn = true;
  req.session.user = user;

  req.flash("success", "Login Success! Welcome to Wetube.");
  return res.redirect("/");
};

export const githubLoginStart = (req, res) => {
  //redirecting user to github Page and make him choose to authorize
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    // redirect_uri: "http://localhost:4000/users/github/callback",
    allow_signup: false,
    scope: "read:user user:email",
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;
  res.redirect(finalUrl);
};

export const githubLoginEnd = async (req, res) => {
  //being ready for getting access_token
  const baseUrl = "https://github.com/login/oauth/access_token";
  const config = {
    client_id: process.env.GH_CLIENT,
    client_secret: process.env.GH_SECRET,
    code: req.query.code,
  };
  const params = new URLSearchParams(config).toString();
  const finalUrl = `${baseUrl}?${params}`;

  // converting code to access_token
  const tokenRequest = await (
    await fetch(finalUrl, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
  ).json();

  // when access_token is available
  if (tokenRequest.access_token) {
    const { access_token } = tokenRequest;
    const apiUrl = "https://api.github.com";
    // github User data
    const userData = await (
      await fetch(`${apiUrl}/user`, {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();

    // github UserEmail data
    const emailData = await (
      await fetch(`${apiUrl}/user/emails`, {
        method: "GET",
        headers: {
          Authorization: `token ${access_token}`,
        },
      })
    ).json();
    const emailObj = emailData.find(
      (e) => e.primary === true && e.verified === true
    );
    if (!emailObj) {
      req.flash("error", "You don't have verified email");
      return res.redirect("/login");
    }

    let user = await User.findOne({ email: emailObj.email });
    if (!user) {
      // create new account - github account
      user = await User.create({
        email: emailObj.email,
        avatarUrl: userData.avatar_url,
        socialOnly: true,
        password: "",
        username: userData.login,
        name: userData.name ? userData.name : `Github_${userData.login}`,
        location: userData.location,
      });
    }
    req.session.loggedIn = true;
    req.session.user = user;
    req.flash("success", "Login success! Welcome to Wetube.");
    return res.redirect("/");
  } else {
    req.flash("error", "Invalid Access Token!");
    return res.redirect("/login");
  }
};

export const getEdit = (req, res) => {
  return res.render("users/editProfile", { pageTitle: "Edit Profile" });
};
export const postEdit = async (req, res) => {
  const {
    session: {
      user: { _id, avatarUrl },
    },
    body: { username, name, email, location },
    file,
  } = req;
  // email changed? or username changed?
  const isEmailChanged = email !== req.session.user.email;
  const isUsernameChanged = username !== req.session.user.username;

  // check if email exists
  if (isEmailChanged) {
    const emailExists = await User.exists({ email });
    if (emailExists) {
      return res.status(400).render("users/editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "This email already exists!",
      });
    }
  }

  // check if username exists
  if (isUsernameChanged) {
    const usernameExists = await User.exists({ username });
    if (usernameExists) {
      return res.status(400).render("users/editProfile", {
        pageTitle: "Edit Profile",
        errorMessage: "This username already exists!",
      });
    }
  }

  // update user in mongoDB
  const updatedUser = await User.findByIdAndUpdate(
    _id,
    {
      avatarUrl: file ? file.path : avatarUrl,
      username,
      name,
      email,
      location,
    },
    { new: true }
  );
  req.session.user = updatedUser;

  req.flash("success", "Edit Success!");
  return res.redirect("/users/edit");
};

export const getChangePassword = (req, res) => {
  const user = req.session.user;
  if (user.socialOnly) {
    req.flash("error", "Social Login Member has no password.");
    return res.redirect("/");
  }
  return res.render("users/changePassword", { pageTitle: "Change Password" });
};
export const postChangePassword = async (req, res) => {
  // change password
  const {
    session: {
      user: { _id },
    },
    body: { oldPw, newPw, newPwCheck },
  } = req;
  const user = await User.findById(_id);

  // correct Old Password?
  const ok = await bcrypt.compare(oldPw, user.password);
  if (!ok) {
    return res.status(400).render("users/changePassword", {
      pageTitle: "Change Password",
      errorMessage: "Current Password is uncorrect!",
    });
  }
  // is newPw same as newPwCheck?
  if (newPw !== newPwCheck) {
    return res.status(400).render("users/changePassword", {
      pageTitle: "Change Password",
      errorMessage: "Check again Password Confirmation!",
    });
  }

  // update password
  user.password = newPw;
  await user.save();

  req.flash("success", "Password Change Success!");
  return res.redirect("/users/logout");
};

export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => {
  req.session.destroy();
  return res.redirect("/");
};
export const see = async (req, res) => {
  const { id } = req.params;
  const user = await User.findById(id).populate({
    path: "videos",
    populate: {
      path: "owner",
      model: "User",
    },
  });
  if (!user) {
    return res.status(404).render("404", { pageTitle: "User Not Found." });
  }
  return res.render("users/profile", { pageTitle: user.name, user });
};
