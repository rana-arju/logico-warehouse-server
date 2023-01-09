var jwt = require("jsonwebtoken");

exports.generateToken = (payload, expire) => {
  return jwt.sign(payload, process.env.ACCESS_TOKEN_SCRETE, {
    expiresIn: expire,
  });
};
