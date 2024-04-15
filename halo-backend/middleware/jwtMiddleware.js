// import jwtService from "../jwt/jwtServices";
// import User from "../models/user";

// export const checkCookie = async (req, res, next) => {
//   let token = req.cookies;
//   if (token && token.Jwt) {
//     let decoded = jwtService.generateToken(token.Jwt);
//     if (decoded && decoded.data) {
//       let user = await User.findOne(
//         { phone: decoded.data },
//         "_id name phone email avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends"
//       ).exec();
//       console.log(user);
//       if (user) {
//         req.user = {
//           _id: user._id,
//           name: user.name,
//           phone: user.phone,
//           email: user.email,
//           avatar: user.avatar,
//           sex: user.sex,
//           dateOfBirth: user.dateOfBirth,
//           isActive: true,
//           friendRequests: user.friendRequests,
//           sendFriendRequests: user.sendFriendRequests,
//           friends: user.friends,
//         };
//         next();
//       }
//     } else {
//       return res.status(403).json({
//         EM: "Error Authentication",
//       });
//     }
//   } else {
//     return res.status(403).json({
//       EM: "Error from Server",
//     });
//   }
// };
