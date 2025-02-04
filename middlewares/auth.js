const { hashPassword } = require("../utils/hashPassword");
const { generateToken } = require("../utils/generateToken");
const User = require("../models/userModel");

async function authenticateUser(req, res, next) {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findByEmail(email);

    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const hashedPassword = await hashPassword(password);

    if (hashedPassword !== user.user_password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const token = await generateToken({ id: user.id, email: user.email });

    req.token = token;
    req.user = user;

    await User.updateToken(user.id, token);
    
    next();
  } catch (error) {
    console.error("Authentication error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}

module.exports = { authenticateUser };
