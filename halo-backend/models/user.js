import mongoose from "mongoose";
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      require: true,
    },
    phone: {
      type: String,
      require: true,
      unique: true,
    },
    email: {
      type: String,
      require: true,
    },
    password: {
      type: String,
      require: true,
    },
    otp: {
      type: String,
    },
    otpTime: Date,
    avatar: {
      type: {
        uri: {
          type: String,
        },
        color: {
          type: String,
        },
      },
    },
    sex: {
      type: String,
      default: "",
    },
    dateOfBirth: {
      type: String,
      default: "",
    },
    isActive: {
      type: String,
      default: "0",
    },
    role: {
      type: String,
      default: "user",
    },
    friendRequests: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
          ref: "User",
        },
        phone: {
          type: String,
          ref: "User",
        },
        avatar: {
          type: {
            uri: {
              type: String,
            },
            color: {
              type: String,
            },
          },
          ref: "User",
        },
      },
    ],
    sendFriendRequests: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
          ref: "User",
        },
        phone: {
          type: String,
          ref: "User",
        },
        avatar: {
          type: {
            uri: {
              type: String,
            },
            color: {
              type: String,
            },
          },
          ref: "User",
        },
      },
    ],
    friends: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        name: {
          type: String,
          ref: "User",
        },
        phone: {
          type: String,
          ref: "User",
        },
        email: {
          type: String,
          require: true,
        },
        sex: {
          type: String,
          default: "",
        },
        dateOfBirth: {
          type: String,
          default: "",
        },
        isActive: {
          type: String,
          default: "0",
        },
        avatar: {
          type: {
            uri: {
              type: String,
            },
            color: {
              type: String,
            },
          },
          ref: "User",
        },
      },
    ],
  },
  { timestamps: true }
);
const User = mongoose.model("User", userSchema);
module.exports = User;
