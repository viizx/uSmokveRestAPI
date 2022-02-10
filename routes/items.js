const router = require("express").Router();
const Item = require("../model/Item");
const verify = require("../verifyToken");

// dobavi sve iteme
router.get("/", async (req, res) => {
  try {
    const items = await Item.find();
    res.json(items);
  } catch (error) {
    res.json({ message: error });
  }
});

// nadi odredeni item
router.get("/:itemId", async (req, res) => {
  try {
    const item = await Item.findById(req.params.itemId);
    res.json(item);
  } catch (error) {
    res.json({ message: error });
  }
});

// izbrisi odredeni item
router.delete("/:itemId", verify, async (req, res) => {
  try {
    const item = await Item.deleteOne({ _id: req.params.itemId });
    res.json(item);
  } catch (error) {
    res.json({ message: error });
  }
});

// dodaj novi item
router.post("/", verify, async (req, res) => {
  const item = new Item({
    name: req.body.name,
    body: req.body.body,
    quantity: req.body.quantity,
  });

  try {
    let savedItem = await item.save();
    res.send({ item: savedItem.name });
  } catch (err) {
    res.send(err);
  }
});

// edit item
router.put("/:itemId", async (req, res) => {
  try {
    const updatedItem = await Item.updateOne(
      { _id: req.params.itemId },
      {
        $set: {
          name: req.body.name,
          body: req.body.body,
          quantity: req.body.quantity,
        },
      }
    );
    res.json(updatedItem);
  } catch (error) {
    res.json({ message: error });
  }
});

module.exports = router;
