import mongoose from "mongoose";

const GifSchema = new mongoose.Schema(
  {
    uri: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Gif = mongoose.model("Gif", GifSchema);

export default Gif;
