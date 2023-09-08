const User = require("../db/models/userModel");
const { SECRET_KEY } = process.env;
const gravatar = require("gravatar");
const jwt = require("jsonwebtoken");
const fs = require("fs/promises");
const path = require("path");

const avatarsDir = path.join(__dirname, "../", "public", "avatars");

const signupController = async (req, res) => {
  console.log(req.body);
  const { name, email, password } = req.body;

  const user = await User.findOne({ email });

  if (user) {
    res.status(409).json({ message: "Message email in use" });
    return;
  }

  const avatar = gravatar.url(email);

  const newUser = new User({
    name,
    email,
    password,
    avatar,
  });

  await newUser.hashPassword(password);
  await newUser.save();

  const payload = { id: newUser._id };
  const token = jwt.sign(payload, SECRET_KEY);
  await User.findByIdAndUpdate(newUser._id, { token });
  res.status(201).json({
    token,
    user: {
      name,
      email,
      avatar,
    },
  });
};

const loginController = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    res.status(401).json({ message: "Email or password invalid" });
    return;
  }

  const compare = await user.comparePassword(password);

  if (!compare) {
    res.status(401).json({ message: "Email or password invalid" });
    return;
  }

  const payload = { id: user._id };
  const token = jwt.sign(payload, SECRET_KEY);

  await User.findByIdAndUpdate(user._id, { token });
  res.json({
    token,
    user: {
      name: user.name,
      email,
      avatar: user.avatar,
    },
  });
};

const logoutControllers = async (req, res) => {
  const { _id } = req.user;
  await User.findByIdAndUpdate(_id, { token: "" });
  res.status(204).send();
};

const currentControllers = (req, res) => {
  const { email, name, avatar } = req.user;
  res.status(200).json({ email, name, avatar });
};

const updateAvatar = async (req, res) => {
  const { _id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const fileName = `${_id}_${originalname}`;
  const resultUpload = path.join(avatarsDir, fileName);
  await fs.rename(tempUpload, resultUpload);
  const avatarURL = path.join("avatar", fileName);
  await User.findByIdAndUpdate(_id, { avatar: avatarURL });
  res.status(200).json({ avatar: avatarURL });
};

module.exports = {
  signupController,
  loginController,
  logoutControllers,
  currentControllers,
  updateAvatar,
};
