const router = require("express").Router();
const User = require("../model/User.js");

router.post("/register", async (req, res) => {
  const user = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    let savedUser = await user.save();
    res.send(savedUser);
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
