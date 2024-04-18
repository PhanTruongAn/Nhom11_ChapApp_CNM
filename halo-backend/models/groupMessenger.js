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
    receiver: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
          required: true,
        },
        phone: {
          type: String,
        },
        email: {
          type: String,
        },
        avatar: {
          uri: {
            type: String,
          },
          color: {
            type: String,
          },
        },
      },
    ],
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
