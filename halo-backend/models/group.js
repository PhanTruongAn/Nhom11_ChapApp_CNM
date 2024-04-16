import mongoose from "mongoose";

const GroupSchema = new mongoose.Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    avatar: {
      type: {
        uri: {
          type: String,
          default: "",
        },
      },
      default: { uri: "" },
    },
  },
  { timestamps: true }
);

const Group = mongoose.model("Group", GroupSchema);

export default Group;
