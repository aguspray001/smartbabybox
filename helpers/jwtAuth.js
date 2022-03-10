const jwtHandler = require("./jwtHandler");

exports.jwtAuthMiddleware = (req, res, next) => {
  const token = req.headers["bb-token"];
  if (token && jwtHandler.verify(token)) {
    req.user = jwtHandler.verify(token);
    next();
  } else {
    res.status(401).json({ message: "Token invalid" });
  }
};
