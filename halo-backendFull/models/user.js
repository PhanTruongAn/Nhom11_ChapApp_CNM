import mongoose from "mongoose";
import bcrypt from "bcrypt";
import validator from "validator";

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
      validate: validator.isEmail,
      unique: true,
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

userSchema.pre("save", function (next) {
  if (!this.isModified("password")) return next();
  const salt = bcrypt.genSaltSync(12);
  this.password = bcrypt.hashSync(this.password, salt);
  next();
});

userSchema.pre("updateOne", async function (next) {
  const update = this.getUpdate();
  if (update.password) {
    const user = await this.model.findOne(this.getQuery());
    if (user && user.password !== update.password) {
      const salt = await bcrypt.genSalt(12);
      const hashedPassword = await bcrypt.hash(update.password, salt);
      update.password = hashedPassword;
    }
    next();
  }
  next();
});

userSchema.methods.comparePassword = function (currentPassword, userPassword) {
  return bcrypt.compareSync(currentPassword, userPassword);
};

const User = mongoose.model("User", userSchema);
module.exports = User;
