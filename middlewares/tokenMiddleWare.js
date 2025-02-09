const dotenv =  require('dotenv');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
dotenv.config();
const checkTokenMiddleware = async (req, res, next) => {
  
  const tokenHeader = req.headers['authorization'];
  
  if (!tokenHeader) {
    return res.status(403).json({ message: 'No token provided' });
  }

  const token = tokenHeader.split(' ')[1];

  if (!token) {
    return res.status(403).json({ message: 'Token malformed or missing' });
  }

  try {
    console.log('before decoded: ');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

module.exports = { checkTokenMiddleware };