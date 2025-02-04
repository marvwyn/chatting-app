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
  console.log('token: ',token);

  if (!token) {
    return res.status(403).json({ message: 'Token malformed or missing' });
  }

  try {
    console.log('before decoded: ');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('after decoded: ');
  
    req.user = decoded;

    const user = await User.getUsersByToken(token);
    if (!user) {
      return res.status(401).json({ message: 'Invalid or expired token' });
    }

    req.user = user;
    next();

  } catch (err) {
    return res.status(401).json({ message: 'Invalid or expired token', error: err.message });
  }
};

module.exports = { checkTokenMiddleware };