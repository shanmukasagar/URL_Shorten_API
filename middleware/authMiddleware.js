const isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next(); // User is authenticated, proceed to the next middleware/route
  }
  res.status(401).json({ message: 'Unauthorized' }); // User is not authenticated
};

module.exports = isAuthenticated;