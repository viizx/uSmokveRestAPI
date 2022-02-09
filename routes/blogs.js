const router = require("express").Router();
const Blog = require("../model/Blog");
const verify = require("../verifyToken");
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.json({ message: error });
  }
});

router.post("/", verify, async (req, res) => {
  const blog = new Blog({
    title: req.body.title,
    body: req.body.body,
  });

  try {
    let savedBlog = await blog.save();
    res.send({ blog: savedBlog.title });
  } catch (err) {
    res.send(err);
  }
});

module.exports = router;
