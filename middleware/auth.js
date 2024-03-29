const jwt = require("jsonwebtoken");
exports.auth = (req, res, next) => {
  try {
    let tmp = req.header("Authorization");
    const token = tmp && tmp.split(" ")[1];
    if (!token) {
      return res.status(404).json({ message: "Unauthorize access" });
    }
    if (token) {
      jwt.verify(token, process.env.ACCESS_TOKEN_SCRETE, function (err, user) {
        if (err) {
          return res.status(403).send({ message: "Forbidden access" });
        }
        req.user = user;
        next();
      });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
