const router = require("express").Router();
const User = require("../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
router.post("/register", async (req, res) => {
  //validate the data before creating the user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  //check duplicate
  const emailExists = await User.findOne({ email: req.body.email });
  if (emailExists) return res.status(400).send("email aldeady exists");

  //hash the password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  //create new user
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hashedPassword,
  });

  try {
    let savedUser = await user.save();
    res.send({ user: savedUser._id });
  } catch (err) {
    res.send(err);
  }
});

router.post("/login", async (req, res) => {
  //validate the data before creating the user
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check duplicate
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email doesn't exist");
  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("wrong password");

  //create and assign token
  const token = await jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
