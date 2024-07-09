const jwt = require("jsonwebtoken");

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({
      status: "error",
      message: "Access denied, no token provided",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // This should now include userId and email
    console.log(req.user);
    console.log("Decoded JWT:", req.user); // Debug log
    next();
  } catch (ex) {
    res.status(400).json({
      status: "error",
      message: "Invalid token",
    });
  }
};

module.exports = { authenticate };
