import jwt from "jsonwebtoken";
require("dotenv").config();
const signToken = (data) => {
  let token = null;
  try {
    token = jwt.sign(
      {
        data: data,
      },
      process.env.JWT_KEY,
      { expiresIn: "1h" }
    );
  } catch (error) {
    console.log(error);
  }
  return token;
};
const generateToken = (token) => {
  let decoded = null;
  try {
    decoded = jwt.verify(token, process.env.JWT_KEY);
  } catch (error) {
    console.log(error);
  }
  return decoded;
};

module.exports = { signToken, generateToken };
