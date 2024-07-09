const jwt = require("jsonwebtoken");

const generateToken = (userId, email) => {
  console.log(email);
  console.log(userId);
  const token = jwt.sign({ userId, email }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  return token;
};

module.exports = generateToken;
