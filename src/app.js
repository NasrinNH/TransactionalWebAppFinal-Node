const express = require("express");
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
var bcrypt = require("bcrypt-nodejs");

const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const app = express();
app.use(express.json());

app.use(
  cors({
    origin: "https://transactionalwebappfinal-react.onrender.com",
    methods: ["GET", "POST"],
  })
);

if (process.env.NODE_ENV === "development") {
  console.log("development mode");
  app.use(morgan("dev"));
}

if (process.env.NODE_ENV === "production") {
  console.log("production mode");
}

const DB_String = process.env.DB_STRING.replace(
  "<password>",
  process.env.DB_PASSWORD
);

mongoose
  .connect(DB_String)
  .then(() => console.log("Successfully connected to DataBase"));

const groupSchema = new mongoose.Schema({
  name: String,
  image_Group: String,
  id: Number,
});
const Group = mongoose.model("Group", groupSchema);

const productSchema = new mongoose.Schema({
  id: Number,
  name: String,
  group: Number,
  price: String,
  reducedPrice: String,
  minOrder: Number,
  canBeSold: Boolean,
  pricePreFix: String,
  imageUrl: String,
  onPromotion: Boolean,
});
const Product = mongoose.model("Product", productSchema);

const userSchema = new mongoose.Schema({
  f_name: String,
  l_name: String,
  email: String,
  password: String,
  role: String,
});
const User = mongoose.model("User", userSchema);

app.post("/signin", async function (req, res) {
  const user = await User.findOne({ email: req.body.email });

  if (user && user.password === req.body.password) {
    const { password, ...rest } = user.toObject();
    res.status(200).send({ user: rest });
  } else {
    res.status(401).send({ status: "error" });
  }
});

app.post("/signup", (req, res) => {
  getUser(req.body.email)
    .then((user) => {
      if (user) {
        res.status(401).send({ status: "error" });
      } else {
        const tobeSavedUser = new User({ ...req.body, role: "costumer" });
        tobeSavedUser.save();
        res.status(201).send({ user: "success" });
      }
    })
    .catch((err) => res.status(401).send({ status: "error" }));
});

async function getUser(email) {
  const user = await User.findOne({ email });
  return user;
}

app.get("/products", (req, res) => {
  Product.find({})
    .then((products) => {
      const newProducts = [];
      products.forEach((product) => {
        var temp = product.toObject();
        temp.isOnPromotion = product.price !== product.reducedPrice;
        newProducts.push(temp);
      });
      res.send(newProducts);
    })
    .catch((error) => console.error("All Address ERROR!!! ->", error));
});

app.get("/groups", (req, res) => {
  Group.find({})
    .then((data) => {
      res.send(data);
    })
    .catch((error) => console.error("All Address ERROR!!! ->", error));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`App is running on port ${port}`);
});
