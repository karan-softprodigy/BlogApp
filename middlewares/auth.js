const jwt = require("jsonwebtoken");

const authentication = (req, res, next) => {
  const cookie = req.cookies;
  if (!cookie.token) {
    return res.redirect("/signin");
  }

  try {
    const token = cookie.token;
    const isValidToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    if (!isValidToken) {
      return res.redirect("/signin");
    }
  } catch (error) {
    return res.redirect("/signin");
  }

  next();
};

const isUserLoggedIn = (req, res) => {
  const cookie = req.cookies;
  try {
    if (cookie.token) {
      const token = cookie.token;
      const isValidUser = jwt.verify(token, process.env.JWT_SECRET_KEY);
      if (Object.keys(isValidUser).length) {
        return isValidUser;
      } else {
        return {};
      }
    } else {
      return {};
    }
  } catch (err) {
    return {};
  }
};

module.exports = { authentication, isUserLoggedIn };
