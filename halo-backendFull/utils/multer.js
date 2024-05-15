import multer from "multer";
import crypto from "crypto";

const configMulter = () => {
  const storage = multer.diskStorage({
    destination(req, file, callback) {
      callback(null, "public");
    },
    filename(req, File, callback) {
      const ext = file.originalname.split(".")[1];
      const filename = crypto
        .createHash("sha256")
        .update(file.originalname)
        .digest("hex");
      callback(null, filename + "." + ext);
    },
  });

  const fileFilter = (req, file, callback) => {
    if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
    ) {
      callback(null, true);
    } else {
      callback(null, false);
    }
  };
  return multer({ storage, fileFilter });
};

export default configMulter;
