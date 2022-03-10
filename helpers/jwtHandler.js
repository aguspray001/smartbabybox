const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

exports.sign = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET);
};

exports.verify = (token) => {
  try {
    return jwt.verify(token, process.env.TOKEN_SECRET);
  } catch (e) {
    return false;
  }
};

exports.decode = (token) => {
  return jwt.decode(token, { complete: true });
};
