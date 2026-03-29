const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// 🔐 REGISTER
router.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({ ...req.body, password: hashed });
  await user.save();
  res.json({ message: "User registered" });
});

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return res.json({ message: "User not found" });

  const ok = await bcrypt.compare(req.body.password, user.password);
  res.json({ message: ok ? "Login successful" : "Wrong password" });
});

// 📦 ORDER SCHEMA
const orderSchema = new mongoose.Schema({
  name: String,
  address: String,
  phone: String,
  cart: Array
});

const Order = mongoose.model("Order", orderSchema);

// 📦 ORDER ROUTE
router.post("/order", async (req, res) => {
  try {
    const order = new Order(req.body);
    await order.save();

    res.json({ message: "Order saved successfully" });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Error saving order" });
  }
});

// ✅ ALWAYS LAST
module.exports = router;