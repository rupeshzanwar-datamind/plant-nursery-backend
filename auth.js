const express = require("express");
const router = express.Router();
const User = require("./user");
const bcrypt = require("bcryptjs");

router.post("/register", async (req, res) => {
  const hashed = await bcrypt.hash(req.body.password, 10);
  const user = new User({...req.body, password: hashed});
  await user.save();
  res.json({message:"User registered"});
});

router.post("/login", async (req, res) => {
  const user = await User.findOne({email:req.body.email});
  if(!user) return res.json({message:"User not found"});

  const ok = await bcrypt.compare(req.body.password, user.password);
  res.json({message: ok?"Login successful":"Wrong password"});
});

module.exports = router;