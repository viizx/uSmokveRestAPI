const router = require("express").Router();
const User = require("../model/User.js");
const { registerValidation } = require("../validation");
router.post("/register", async (req, res) => {
  //validate the data before creating the user
  const { error } = registerValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

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
