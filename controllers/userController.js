const User = require('../models/userModel');
const { hashPassword } = require('../utils/hashPassword.js');

(async () => {
  await User.sync();
  console.log('Users table is ready');
})();

const signin = {
  get: (req, res) => {
    res.render('signin');
  },
  post: (req, res) => {
    const token = req.token;
    console.log('token ', req.token);
    
    if (!token) {
      return res.status(400).json({ message: "Token and User ID are required" });
    }
    try {
      res.json({ redirect: "/chats", token });
    } catch (error) {
      res.status(500).json({ error: "Error loading chat history page" });
    }
  },
};

const signup = {
  get: (req, res) => res.render('signup'),
  post: async (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password)
      return res.status(400).json({ message: 'All fields are required' });
    
    try {
      const hashedPassword = await hashPassword(password);
      await User.create({ email, username: name, user_password: hashedPassword });
      res.status(200).json({ message: 'User registered successfully' });
    } catch (error) {
      res.status(500).json({ message: 'Error signing up', error: error.message });
    }
  },
};

const logout = (req, res) => {
  return res.status(200).json({ status: 'success' });
};

module.exports = { signin, signup, logout };
