import userService from "../services/userServices";
// Handler Check Validate
const handlerCheckValidate = async (req, res) => {
  try {
    let data = await userService.checkValidate(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Lỗi từ server",
      EC: -1,
      DT: [],
    });
  }
};

// Handler Registry
const handlerRegistry = async (req, res) => {
  try {
    let data = await userService.userRegistry(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đăng ký không thành công",
      EC: -1,
      DT: [],
    });
  }
};
// Handler Confirm Account
const handleConfirmAccount = async (req, res) => {
  try {
    let data = await userService.confirmAccount(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Xác thực không thành công",
      EC: -1,
      DT: [],
    });
  }
};
// Handler Login
const handleLogin = async (req, res) => {
  try {
    let data = await userService.userLogin(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      EM: "Đăng nhập thất bại",
      EC: -1,
      DT: [],
    });
  }
};
const handlerGetDataById = async (req, res) => {
  try {
    let data = await userService.getDataById(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
// const handlerLoginUser = async (req, res) => {
//   try {
//     if (req.user) {
//       return res.status(200).json({
//         EM: "User information",
//         EC: 0,
//         DT: req.user,
//       });
//     } else {
//       return res.status(500).json({
//         EM: "Error from sever",
//       });
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };
const handlerSearchByPhone = async (req, res) => {
  try {
    let data = await userService.searchByPhone(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};

const handlerForgotPassword = async (req, res) => {
  try {
    let data = await userService.forgotPassword(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const handlerUpdateUser = async (req, res) => {
  try {
    let data = await userService.updateUser(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const handlerChangePassword = async (req, res) => {
  try {
    let data = await userService.changePassword(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};
const handlerNewOtp = async (req, res) => {
  try {
    let data = await userService.resendOTP(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  handlerCheckValidate,
  handlerRegistry,
  handleLogin,
  // handlerLoginUser,
  handlerSearchByPhone,
  handlerUpdateUser,
  handlerChangePassword,
  handleConfirmAccount,
  handlerNewOtp,
  handlerForgotPassword,
  handlerGetDataById,
};
