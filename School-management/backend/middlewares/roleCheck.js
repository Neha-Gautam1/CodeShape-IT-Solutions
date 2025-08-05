// middlewares/roleCheck.js

// Middleware to restrict access based on user role
const roleCheck = (allowedRoles) => (req, res, next) => {
  if (
    req.user &&                     // Ensure user is attached to req (via auth middleware)
    req.user.email &&              // Confirm user identity
    allowedRoles.includes(req.user.role) // ✅ Check if user's role is allowed
  ) {
    next(); // Proceed if role is allowed
  } else {
    res.status(403).json({ message: "Forbidden: Insufficient permissions" }); // Deny otherwise
  }
};

export default roleCheck;
