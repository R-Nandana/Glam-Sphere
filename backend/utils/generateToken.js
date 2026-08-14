const jwt = require("jsonwebtoken");

const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  });

  // Set cookie (works for same-domain; cross-domain needs sameSite: none + secure)
  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // always secure so sameSite=none works
    sameSite: "none", // Required for cross-domain (Vercel frontend + Render backend)
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  return token;
};

module.exports = generateToken;
