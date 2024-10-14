// backend/middleware/auth.js
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;

const authMiddleware = (req, res, next) => {
  // Extract token from the Authorization header (expecting 'Bearer TOKEN')
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Authorization header missing, authorization denied' });
  }

  const token = authHeader.split(' ')[1]; // Extract token part after 'Bearer'
  
  if (!token) {
    return res.status(401).json({ message: 'No token provided, authorization denied' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET); // Verify token using secret
    req.user = decoded; // Attach user details (id and role) to req.user
    next(); // Pass to the next middleware or route handler
  } catch(err) {
    res.status(401).json({ message: 'Token is not valid, authorization denied' });
  }
};

module.exports = authMiddleware;
