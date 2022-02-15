const router = require("express").Router();
const User = require("../model/User.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("../validation");
const verify = require("../verifyToken");
const Token = require("../model/Token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
// dobavi korisnike
router.get("/", verify, async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.json({ message: error });
  }
});
// dobavi korisnika
router.get("/:userId", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    res.json(user);
  } catch (error) {
    res.json({ message: error });
  }
});
// registriraj korisnika
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
    isVerified: false,
    isAdmin: false,
  });

  try {
    let savedUser = await user.save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();
    const url = `${process.env.BASE_URL}/api/user/${user._id}/verify/${token.token}`;
    await sendEmail(user.email, "Verify Email", url);
    res.send({ user: savedUser._id });
  } catch (error) {
    res.send(error);
  }
});

// verifikacija korisnika
router.get("/:userId/verify/:token", async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.userId });
    if (!user) return res.status(400).send({ message: "Invalid Link" });

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) return res.status(400).send({ message: "invalid Link" });

    const updatedUser = await User.updateOne(
      { _id: user._id },
      { $set: { isVerified: true } }
    );
    await token.remove();
    res.status(200).json(updatedUser);
  } catch (error) {
    res.status(400).send({ message: error });
  }
});
// login korisnika
router.post("/login", async (req, res) => {
  //validate the data before logging in
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  //check that email exists
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.status(400).send("email doesn't exist");
  //password is correct
  const validPass = await bcrypt.compare(req.body.password, user.password);
  if (!validPass) return res.status(400).send("wrong password");

  if (!user.isVerified) {
    let token = await Token.findOne({ userId: user._id });
    if (!token) {
      const token = await new Token({
        userId: user._id,
        token: crypto.randomBytes(32).toString("hex"),
      }).save();
      const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
      await sendVerificationEmail(user.email, "Verify Email", url);
    }
    return status(400).send({
      message: "An email was sent to you, please verify",
    });
  }

  //create and assign token
  const token = await jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
  res.header("auth-token", token).send(token);
});

module.exports = router;
