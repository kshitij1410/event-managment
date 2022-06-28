const jwt = require("jsonwebtoken");

exports.verifyUser = (req, res, next) => {
  if (req.headers.authorization) {
    const token = req.headers.authorization.split(" ")[1];
    const user = jwt.verify(token, process.env.JWT_SECRET);
    req.decoded = user;
    next();
  } else {
    return res.status(400).json({ msg: "authorization required" });
  }
};
