import mongoose from "mongoose";

const GroupMessengerSchema = new mongoose.Schema(
  {
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    group: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    idMessenger: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const GroupMessenger = mongoose.model("GroupMessenger", GroupMessengerSchema);

export default GroupMessenger;
