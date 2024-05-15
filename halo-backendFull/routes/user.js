import { Router } from "express";
import User from "../models/user";
import HandleError from "../utils/HandleError";
import { isAuthenticated } from "../middleware/isAuthenticated";
import { uploadCloud } from "../utils/cloudinary";
import configMulter from "../utils/multer";
import { checkPermission } from "../middleware/checkPermission";

const router = Router();

const upload = configMulter();

router.use(isAuthenticated);

//get all users
router.get("/", async (req, res, next) => {
  try {
    const users = await User.find();

    if (users.length < 0) return next(new HandleError("No Information", 404));
    res.status(200).json({
      status: "success",
      users,
    });
  } catch (error) {
    return next(error);
  }
});

router.get("/:id", async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new HandleError("Not found user", 404));
    res.status(200).json({ status: "success", user });
  } catch (error) {
    return next(error);
  }
});

router.use(checkPermission(["admin"]));
router.post("/", upload.single("avatar"), async (req, res, next) => {
  try {
    const { email, phone, password, name, role } = req.body;
    const existingUser = await User.findOne({
      $or: [{ email }, { phone }],
    });
    if (existingUser) {
      res
        .status(404)
        .json({ status: "User already exists", message: "Phone number or email already exists" });
      return next(new HandleError("User already exists", 404));
    }
      
    // let avatar = "";
    // if (req.file) {
    //   const path = req.file?.path === undefined ? "" : req.file.path;
    //   avatar = await uploadCloud(path, "test");
    // } else {
    //   avatar =
    //     "https://res.cloudinary.com/dyp4yk66w/image/upload/v1713286041/test/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg_xelkvb.jpg";
    // }

    console.log(password);
    const user = new User({
      phone,
      password,
      email,
      name,
      // avatar,
      role,
    });
    await user.save();
    res
      .status(201)
      .json({ status: "success", message: "User created successfully" });
  } catch (error) {
    return next(error);
  }
});

router.put("/:id", upload.single("avatar"), async (req, res, next) => {
  try {
    const { id } = req.params;
    const { phone, name, email, password, role } = req.body;
    // let avatar = "";
    // if (!req.body.avatar) {
    //   const path = req.file?.path === undefined ? "" : req.file.path;
    //   avatar = await uploadCloud(path, "test");
    // } else {
    //   avatar = req.body.avatar;
    // }
    const user = await User.findById(id);
    if (!user) return next(new HandleError("User not found", 404));

    await user.updateOne({
      phone,
      name,
      email,
      password,
      // avatar,
      role,
    });
    res.status(200).json({ status: "success", message: "Update Successfully" });
  } catch (error) {
    return next(error);
  }
});


router.delete("/:id", async (req, res, next) => {
  try {
    console.log("paramsTestParams: ", req.params);
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) return next(new HandleError("User not found", 404));

    await user.deleteOne();
    res.status(200).json({ status: "success", message: "Delete Successfully" });
  } catch (error) {
    return next(error);
  }
});

export default router;
