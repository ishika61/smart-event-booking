const jwt = require("jsonwebtoken");
require("dotenv").config();

exports.loginAdmin = (req, res) => {
  const { email, password } = req.body;

  if (email !== "admin@gmail.com" || password !== "admin123") {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  res.json({ token });
};
