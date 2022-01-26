import User from "../models/User.js";
import bcrypt from "bcrypt";
import fetch from "node-fetch";

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

  req.session.loggedIn = true;
  req.session.user = user;

  return res.redirect("/");
};

export const githubLoginStart = (req, res) => {
  //redirecting user to github Page and make him choose to authorize
  const baseUrl = "https://github.com/login/oauth/authorize";
  const config = {
    client_id: process.env.GH_CLIENT,
    redirect_uri: "http://localhost:4000/users/github/callback",
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
    console.log(userData);

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
      return res.redirect("/login");
    }

    const existingUser = await User.findOne({ email: emailObj.email });
    if (existingUser) {
      // existing Email? then, login by existing User
      req.session.loggedIn = true;
      req.session.user = existingUser;
      console.log("existing user log in!");
      return res.redirect("/");
    } else {
      // create new account - github account
      const newUser = await User.create({
        email: emailObj.email,
        isGit: true,
        password: "",
        username: userData.login,
        name: `Github_${userData.login}`,
        location: userData.location,
      });
      req.session.loggedIn = true;
      req.session.user = newUser;
      console.log("create New Account");
      return res.redirect("/");
    }
  } else {
    console.log("No Access Token!");
    return res.redirect("/login");
  }
};

export const edit = (req, res) => res.send("Edit User");
export const remove = (req, res) => res.send("Remove User");
export const logout = (req, res) => res.send("logout");
export const see = (req, res) => res.send("see");
