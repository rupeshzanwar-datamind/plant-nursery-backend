const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");

// 🔐 REGISTER
router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.json({ message: "All fields required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.json({ message: "Invalid email format" });
  }

  if (password.length < 6) {
    return res.json({ message: "Password must be at least 6 characters" });
  }

  const hashed = await bcrypt.hash(password, 10);
  const user = new User({ name, email, password: hashed });

  await user.save();
  res.json({ message: "User registered" });
});

// 🔐 LOGIN
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ message: "All fields required" });
  }

  const user = await User.findOne({ email });
  if (!user) return res.json({ message: "User not found" });

  const ok = await bcrypt.compare(password, user.password);
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
  const { name, address, phone, cart } = req.body;

  if (!name || !address || !phone) {
    return res.json({ message: "All fields required" });
  }

  if (!/^[0-9]{10}$/.test(phone)) {
    return res.json({ message: "Invalid phone number" });
  }

  if (!cart || cart.length === 0) {
    return res.json({ message: "Cart is empty" });
  }

  const order = new Order({ name, address, phone, cart });
  await order.save();

  res.json({ message: "Order placed successfully" });
});
// ✅ ALWAYS LAST
module.exports = router;