const router = require("express").Router();
const Blog = require("../model/Blog");
const verify = require("../verifyToken");

// dobavi sve blogove
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (error) {
    res.json({ message: error });
  }
});

// nadi odredeni blog
router.get("/:blogId", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.blogId);
    res.json(blog);
  } catch (error) {
    res.json({ message: error });
  }
});

// izbrisi odredeni blog
router.delete("/:blogId", verify, async (req, res) => {
  try {
    const removeBlog = await Blog.deleteOne({ _id: req.params.blogId });
    res.json(removedBlog);
  } catch (error) {
    res.json({ message: error });
  }
});

// stvori novi blog
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
