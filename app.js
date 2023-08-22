const express = require("express");
const mongoose = require("mongoose");
const bodyparser = require("body-parser");
const mongoDB = "mongodb://127.0.0.1:27017/todolistdb";
const app = express();

app.set("view engine", "ejs"); // for ejs file
app.use(express.static("public"));
app.use(bodyparser.urlencoded({ extended: true }));
//----------------------------------------------------------->>>
// MongoDB connections
(async () => {
  try {
    await mongoose.connect(mongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error);
  }
})();
// ------------------------------------------------------------->>>
//creating Schema for Mongo Datbase----------------------------->>>
const itemSchema = {
  name: { type: "String", required: true },
};
//creating mongoose model act's as objects---------------------->>>
const Item = mongoose.model("Item", itemSchema);
const item1 = new Item({
  name: "WELCOME",
});
const item2 = new Item({
  name: " TODOLIST",
});

//Array of model's----------------------------------------------->>>
const d = [item1, item2];
// Item.insertMany(d)
//   .then(() => {
//     console.log("success");
//   })
//   .catch((error) => {
//     console.log("fail:", error);
//   });

app.get("/", function (req, res) {
  Item.find({})
    .exec()
    .then((foundItems) => {
      if (foundItems.length === 0) {
        Item.insertMany(d)
          .then(() => {
            console.log("success");
          })
          .catch((error) => {
            console.log("fail:", error);
          });
        res.redirect("/");
      } else {
        res.render("list", { newListItems: foundItems });
      }
    })
    .catch((error) => {
      console.error("Error fetching items:", error);
      res.status(500).send("Error fetching items");
    });
});

app.post("/", function (req, res) {
  console.log(req.body);
  const itemName = req.body.newListItem;
  //   i1.push(i);
  //    res.render("list",{newListItem:i})
  //   res.redirect("/");
  const item = new Item({
    name: itemName,
  });
  item.save();
  res.redirect("/");
});
app.post("/delete", function (req, res) {
  const d = req.body.checkbox;
  Item.findByIdAndRemove(d)
    .then(() => {
      console.log("Deleted");
      res.redirect("/");
    })
    .catch((error) => {
      console.log("fail:", error);
    });
});

app.listen(3000, function () {
  console.log("Running");
});
