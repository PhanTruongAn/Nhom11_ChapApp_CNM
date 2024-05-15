import { v2 as cloudinary } from "cloudinary";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

export async function uploadCloud(path, folder) {
  try {
    const result = await cloudinary.uploader.upload(path, { folder });
    return result.secure_url;
  } catch (error) {
    console.log("Error uploading image:", error);
    throw new Error("Failed to upload image");
  }
}
