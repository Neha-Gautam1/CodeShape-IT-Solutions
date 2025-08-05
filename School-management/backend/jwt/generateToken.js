// Import JWT library
import jwt from 'jsonwebtoken';

// Function to generate JWT token and store it in a cookie
export const generateToken = (userId, role, res) => {
  // Create a JWT token with payload: user ID and role
  const token = jwt.sign({ userId, role }, process.env.JWT_TOKEN, {
    expiresIn: '5d', // Token will expire in 5 days
  });

  // Set the token as an HTTP-only cookie to be sent with the response
  res.cookie('token', token, {
    httpOnly: true,      // Cookie cannot be accessed via JavaScript (prevents XSS)
    secure: false,       // Should be true in production (for HTTPS only)
    sameSite: 'strict',  // Prevents CSRF by only sending cookie from same site
    maxAge: 5 * 24 * 60 * 60 * 1000, // 5 days in milliseconds
  });
};
