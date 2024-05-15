import { NextFunction, Request, Response, Router } from "express";
import User from "../models/user";
import HandleError from "../utils/HandleError";
import jwt, { JwtPayload } from "jsonwebtoken";
import { isAuthenticated } from "../middleware/isAuthenticated";
import bcrypt from "bcrypt";

const router = Router();

//generate salt
const generateSalt = () => {
  return bcrypt.genSaltSync(12);
};

//register
router.post("/register", async (req, res, next) => {
  try {
    const { email, phone } = req.body;
    const existingUser = await User.find({
      $or: [{ email }, { phone }],
    });
    if (existingUser.length > 0)
      return next(new HandleError("Phone or email already exists", 400));
    User.create(req.body).then((user) => {
      res.status(201).json({ status: "success", user });
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/login", async (req, res, next) => {
  try {
    const { email, phone, password } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (!user || !user.comparePassword(password, user.password))
      return next(new HandleError("Incorrect phone,email or password", 400));
    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET ? process.env.JWT_SECRET : "",
      {
        expiresIn: "1h",
      }
    );

    res.cookie("token", { token }, { httpOnly: true });
    res.cookie("user", { user }, { httpOnly: true });
    res.status(200).json({
      status: "success",
      token,
      user,
    });
  } catch (error) {
    return next(error);
  }
});

router.post("/logout", async (req, res, next) => {
  try {
    res.clearCookie(req.cookies.token);
    res.clearCookie(req.cookies.user);
    res.status(200).json({ status: "success", message: "logout" });
  } catch (error) {
    return next(error);
  }
});

router.put("/reset-password/:token", async (req, res, next) => {
  try {
    const { token } = req.params;
    if (!token) return next(new HandleError("Unauthorized", 401));

    const { password, confirmPassword } = req.body;
    if (password !== confirmPassword)
      return next(new HandleError("Password Confirm not the same", 400));

    const jwtSecret = process.env.JWT_SECRET ?? "default_secret"; // Sử dụng giá trị mặc định nếu biến môi trường không được định nghĩa

    const decode = jwt.verify(token, jwtSecret);

    // Kiểm tra cấu trúc của decode
    if (!decode || typeof decode !== "object" || !decode.id) {
      throw new Error("Invalid token payload");
    }

    const { id } = decode;
    const salt = generateSalt();
    const newPassword = bcrypt.hashSync(password, salt);
    await User.findByIdAndUpdate(id, { password: newPassword }, { new: true });

    res
      .status(200)
      .json({ status: "success", message: "Password Changed Successfully" });
  } catch (error) {
    return next(error);
  }
});

router.put("/change-password", isAuthenticated, async (req, res, next) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    const userId = req.user?.id;
    const user = await User.findById(userId);

    if (!user) return next(new HandleError("Unauthorization", 401));

    if (!user.comparePassword(currentPassword, user.password))
      return next(new HandleError("Incorrect current password", 400));

    if (newPassword !== confirmPassword)
      return next(new HandleError("Password confirm not same", 400));

    const salt = generateSalt();
    const password = bcrypt.hashSync(newPassword, salt);
    await User.findByIdAndUpdate(user.id, { password }, { new: true });

    res
      .status(200)
      .json({ status: "success", message: "Password have been changed" });
  } catch (error) {
    return next(error);
  }
});
export default router;
