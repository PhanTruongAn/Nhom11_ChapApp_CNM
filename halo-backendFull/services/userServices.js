// // User Registry
import User from "../models/user";
import bcrypt from "bcrypt";
import userValidate from "../validates/userValidate";
import jwtService from "../jwt/jwtServices";
const OTP_EXPIRE_MINUTE = parseInt(process.env.OTP_EXPIRE_MINUTE);
import commonUtils from "../utils/commonUtils";
import templateHtml from "../utils/templateHtml";
import { mailer } from "../utils/mailer";
import { use } from "passport";
const salt = bcrypt.genSaltSync(10);
const hashPassword = (password) => {
  const hash = bcrypt.hashSync(password, salt);
  return hash;
};
// User Validate
const checkValidate = async (user) => {
  const nameCheck = userValidate.checkUsername(user.name);
  if (nameCheck.EC !== 0) {
    return nameCheck;
  }
  const phoneCheck = await userValidate.checkPhone(user.phone);
  if (phoneCheck.EC !== 0) {
    return phoneCheck;
  }
  const emailCheck = userValidate.checkEmail(user.email);
  if (emailCheck.EC !== 0) {
    return emailCheck;
  }
  const passCheck = userValidate.checkPass(user.password);
  if (passCheck.EC !== 0) {
    return passCheck;
  }
  return {
    EC: 0,
  };
};
// User Registry
const userRegistry = async (user) => {
  const newPassword = hashPassword(user.password);
  const newUser = new User({ ...user, newPassword });
  const saveUser = await newUser.save();
  const { _id, email } = saveUser;
  const userFull = await sendOtp(_id, email);
  return {
    EC: 0,
    DT: userFull.DT,
  };
};
// Confirm account
const confirmAccount = async (user) => {
  const account = await User.findOne(
    { phone: user.phone },
    "name phone avatar email otp otpTime"
  ).exec();
  if (account) {
    if (new Date() > account.otpTime) {
      return {
        EM: "OTP hết hạn",
      };
    }
    try {
      const updatedUser = await User.findOneAndUpdate(
        { _id: user._id },
        {
          $set: {
            otp: "",
            otpTime: Date.now(),
            isActive: "1",
          },
        },
        {
          new: true,
          select: "_id name phone otp otpTime isActive",
        }
      );

      if (!updatedUser) {
        return {
          EM: "Xác thực thất bại!",
        };
      }

      return {
        DT: updatedUser,
        EC: 0,
      };
    } catch (error) {
      console.error("Error from server:", error);
      throw error;
    }
  }
};
// User Login
const userLogin = async (user) => {
  const account = await User.findOne(
    { phone: user.phone },
    "_id name phone email password avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends"
  ).exec();
  if (!account) {
    return {
      EM: "Số điện thoại không tồn tại!",
    };
  }
  const comparePassword = bcrypt.compareSync(user.password, account.password);
  if (comparePassword) {
    // let token = await jwtService.signToken(account.phone);
    const { password, ...userData } = account.toObject(); // Loại bỏ trường password từ đối tượng tài khoản
    if (account.isActive == "0") {
      return {
        EC: 1,
        EM: "Vui lòng xác thực tài khoản để đăng nhập!",
        DT: userData,
      };
    }
    return {
      EC: 0,
      DT: userData,
    };
  } else {
    return {
      EM: "Mật khẩu không đúng!",
    };
  }
};
// SearchByPhone
const searchByPhone = async (user) => {
  const account = await User.findOne(
    { phone: user.phone },
    "name phone avatar email avatar sex dateOfBirth isActive"
  ).exec();
  if (!account) {
    return {
      EM: "Số điện thoại không tồn tại!",
    };
  }
  return {
    DT: account,
    EC: 0,
  };
};
const getDataById = async (user) => {
  const account = await User.findOne(
    { _id: user._id },
    "_id name phone email avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends"
  ).exec();
  if (!account) {
    return {
      EM: "Account is not exist!",
    };
  }

  return {
    DT: account,
    EC: 0,
  };
};
// Update Information User
const updateUser = async (newData) => {
  try {
    const updatedUser = await User.findOneAndUpdate(
      { _id: newData._id },
      {
        $set: {
          name: newData.name,
          sex: newData.sex,
          dateOfBirth: newData.dateOfBirth,
          "avatar.uri": newData.avatar.uri,
        },
      },
      {
        new: true,
        select:
          "_id name phone email avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends",
      }
    );

    if (!updatedUser) {
      console.log("Không tìm thấy người dùng!");
      return {
        DT: null,
        EC: 1, // Mã lỗi tìm thấy người dùng
      };
    }

    return {
      DT: updatedUser,
      EC: 0, // Thành công
    };
  } catch (error) {
    console.error("Lỗi cập nhật người dùng:", error);
    throw error;
  }
};
// Change Password
const changePassword = async (user) => {
  try {
    let newPassword = hashPassword(user.newPassword);

    const updatedUser = await User.findOneAndUpdate(
      { _id: user._id },
      {
        $set: {
          password: newPassword,
        },
      },
      {
        new: true,
        select:
          "_id name phone email avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends",
      }
    );
    return {
      DT: updatedUser,
      EC: 0,
    };
  } catch (error) {
    console.log("Error: ", error);
  }
};
// Forgot Password
const forgotPassword = async (user) => {
  const account = await User.findOne({ email: user.email }).exec();
  if (!account) {
    return {
      EM: "Email không tồn tại!",
    };
  }
  const { _id, email } = account;
  const userFull = await sendOtp(_id, email);
  return {
    EC: 0,
    EM: "Mật khẩu đã được gửi về email của bạn!",
    DT: userFull.DT,
  };
};
// Resend OTP
const resendOTP = async (newUser) => {
  const user = await User.findOne({ email: newUser.email });

  if (user) {
    const { _id, email } = user;

    const userFull = await sendOtp(_id, email);
    return {
      EC: 0,
      EM: "Đã gửi lại OTP xác thực",
      DT: userFull.DT,
    };
  }
};

//Send Otp
const sendOtp = async (_id, email) => {
  const otp = commonUtils.getRandomOTP();
  const otpTime = new Date();
  otpTime.setMinutes(otpTime.getMinutes() + OTP_EXPIRE_MINUTE);
  const regis = await User.findOneAndUpdate(
    { _id: _id },
    {
      $set: {
        otp: otp,
        otpTime: otpTime,
      },
    },
    {
      new: true,
      select: "_id name phone email otp otpTime",
    }
  );
  if (regis)
    mailer.sendMail(
      email,
      "Halo - OTP xác nhận tài khoản",
      templateHtml.getOtpHtml(otp, OTP_EXPIRE_MINUTE)
    );

  return {
    EC: 0,
    EM: "Đã gửi OTP xác thực",
    DT: regis,
  };
};

module.exports = {
  checkValidate,
  userRegistry,
  userLogin,
  searchByPhone,
  updateUser,
  changePassword,
  confirmAccount,
  resendOTP,
  forgotPassword,
  getDataById,
};
