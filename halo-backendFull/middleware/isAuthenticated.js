import { NextFunction, Request, Response } from "express";
import HandleError from "../utils/HandleError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { User } from "../models/user";

// Khai báo interface UserPayload
const UserPayload = {
  id: "",
  role: "",
};

// Mở rộng namespace Express để thêm thuộc tính user vào Request
global.Express = global.Express || {};
global.Express.Request = global.Express.Request || {};
global.Express.Request.user = UserPayload;

export const isAuthenticated = async (req, res, next) => {
  try {
    let token; //file nayf t co sua lai js
    let auth = req.headers.authorization;
    if (auth) {
      token = auth.split(" ")[1];
    } else {
      console.log(req.headers);
      token = req.cookies.token.accessToken;
    }
    if (!token) {
      return next(new HandleError("Unauthorization", 401));
    }
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    if (!decode || typeof decode !== "object" || !decode.id || !decode.role) {
      throw new Error("Invalid token payload");
    }
    req.user = decode;
    next();
  } catch (error) {
    next(error);
  }
};
