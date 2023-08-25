const jwt = require("jsonwebtoken");
const User = require("../db/models/userModel");
const { SECRET_KEY } = process.env;

const authintificate = async (req, res, next) => {
  const { authorization = "" } = req.headers;
  const [bearer, token] = authorization.split(" ");

  if (bearer !== "Bearer") {
    res.status(401).json({ message: "No authorize" });
    return;
  }

  try {
    const { id } = jwt.verify(token, SECRET_KEY);
    const user = await User.findById(id);

    if (!user || !user.token || user.token !== token) {
      res.status(401).json({ message: "No authorize" });
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
  }
};

module.exports = authintificate;
