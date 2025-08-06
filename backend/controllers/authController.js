const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email, password });
  if (!user) return res.status(401).json({ message: "Identifiants invalides" });

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
  res.json({ token, user });
};
