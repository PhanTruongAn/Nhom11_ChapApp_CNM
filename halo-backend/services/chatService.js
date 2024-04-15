import PrivateMessenger from "../models/privateMessenger";
import User from "../models/user";
const sendMessage = async (user) => {
  try {
    let sender = await User.findOne({ phone: user.sender }).exec();
    let receiver = await User.findOne({
      phone: user.receiver,
    }).exec();
    if (sender && receiver && user.text) {
      const chat = new PrivateMessenger({
        idMessenger: user.idMessenger,
        sender: sender,
        receiver: receiver,
        text: user.text,
      });
      const chatData = await chat.save();
      return {
        EM: "Send messenger is success!",
        EC: 0,
        DT: chatData,
      };
    } else {
      return {
        EM: "Send messenger is error!",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log("server " + error);
    return {
      EM: "something wrong from server",
      EC: 1,
      DT: [],
    };
  }
};
const getAllChatPrivate = async (data) => {
  try {
    let sender = await User.findOne({ phone: data.sender }).exec();
    let receiver = await User.findOne({
      phone: data.receiver,
    }).exec();
    if (sender && receiver) {
      const totalDocuments = await PrivateMessenger.countDocuments({
        $or: [
          { sender: sender._id, receiver: receiver._id },
          { sender: receiver._id, receiver: sender._id },
        ],
      });
      const remainingDocuments = Math.max(0, totalDocuments - data.skip);
      const limit = Math.min(6, remainingDocuments);

      let test = await PrivateMessenger.find(
        {
          $or: [
            { sender: sender._id, receiver: receiver._id },
            { sender: receiver._id, receiver: sender._id },
          ],
        },
        {
          idMessenger: 1,
          sender: 1,
          receiver: 1,
          text: 1,
          isDeleted: 1,
          createdAt: 1,
          _id: 0, // Loại bỏ trường _id nếu không cần thiết
        }
      )
        .sort({ createdAt: "desc" })
        .limit(limit)
        .skip(data.skip)
        .exec();
      const reversedGroup = test.reverse();
      return {
        EM: "Get all messenger is success!",
        EC: 0,
        DT: reversedGroup,
      };
    } else {
      return {
        EM: "get all messange is error!",
        EC: 0,
        DT: [],
      };
    }
  } catch (error) {
    console.log("server " + error);
    return {
      EM: "something wrong from server",
      EC: 1,
      DT: [],
    };
  }
};
const getAllUserByChat = async (data) => {
  try {
    const data = await PrivateMessenger.findOne;
  } catch (error) {
    console.log("server " + error);
    return {
      EM: "something wrong from server",
      EC: 1,
      DT: [],
    };
  }
};
// const findDistinctUsers = async (user) => {
//   try {
//     // Tìm tất cả các tin nhắn mà người dùng có ID đã cung cấp đã gửi hoặc nhận
//     const messages = await PrivateMessenger.find({
//       $or: [{ sender: user._id }, { receiver: user._id }],
//     });

//     // Tạo một mảng rỗng để chứa các ID người dùng duy nhất
//     const distinctUsers = [];

//     // Lặp qua tất cả các tin nhắn và lấy ID của người gửi và người nhận khác với người dùng đã cung cấp
//     messages.forEach((message) => {
//       if (
//         message.sender.toString() !== user._id &&
//         !distinctUsers.includes(message.sender.toString())
//       ) {
//         distinctUsers.push(message.sender.toString());
//       }
//       if (
//         message.receiver.toString() !== user._id &&
//         !distinctUsers.includes(message.receiver.toString())
//       ) {
//         distinctUsers.push(message.receiver.toString());
//       }
//     });

//     const usersInfo = await User.find(
//       { _id: { $in: distinctUsers } },
//       {
//         _id: 1,
//         name: 1,
//         phone: 1,
//         // email: 1,
//         avatar: 1,
//         // sex: 1,
//         // dateOfBirth: 1,
//         isActive: 1,
//         // friendRequests: 1,
//         // sendFriendRequests: 1,
//         // friends: 1,
//       }
//     );

//     return {
//       EM: "Get all distinct users is success!",
//       EC: 0,
//       DT: usersInfo,
//     };
//   } catch (error) {
//     console.error("Error finding distinct users:", error);
//     return {
//       EM: "Something went wrong on the server",
//       EC: 1,
//       DT: [],
//     };
//   }
// };
const findDistinctUsers = async (user) => {
  try {
    // Tìm tất cả các tin nhắn mà người dùng có ID đã cung cấp đã gửi hoặc nhận
    const messages = await PrivateMessenger.find({
      $or: [{ sender: user._id }, { receiver: user._id }],
    });

    // Tạo một đối tượng để lưu trữ thông tin người dùng và tin nhắn cuối cùng
    const usersMap = {};

    // Lặp qua tất cả các tin nhắn và lấy ID của người gửi và người nhận khác với người dùng đã cung cấp
    messages.forEach((message) => {
      if (message.sender.toString() !== user._id) {
        if (!usersMap[message.sender.toString()]) {
          usersMap[message.sender.toString()] = {
            userId: message.sender,
            lastMessage: message.text,
            lastMessageTime: message.createdAt,
          };
        } else {
          // So sánh thời gian của tin nhắn hiện tại với tin nhắn cuối cùng đã lưu trữ
          if (
            message.createdAt >
            usersMap[message.sender.toString()].lastMessageTime
          ) {
            usersMap[message.sender.toString()].lastMessage = message.text;
            usersMap[message.sender.toString()].lastMessageTime =
              message.createdAt;
          }
        }
      }
      if (message.receiver.toString() !== user._id) {
        if (!usersMap[message.receiver.toString()]) {
          usersMap[message.receiver.toString()] = {
            userId: message.receiver,
            lastMessage: message.text,
            lastMessageTime: message.createdAt,
          };
        } else {
          // So sánh thời gian của tin nhắn hiện tại với tin nhắn cuối cùng đã lưu trữ
          if (
            message.createdAt >
            usersMap[message.receiver.toString()].lastMessageTime
          ) {
            usersMap[message.receiver.toString()].lastMessage = message.text;
            usersMap[message.receiver.toString()].lastMessageTime =
              message.createdAt;
          }
        }
      }
    });

    const distinctUsers = Object.values(usersMap);

    const usersInfo = await User.find(
      { _id: { $in: distinctUsers.map((user) => user.userId) } },
      {
        _id: 1,
        name: 1,
        phone: 1,
        avatar: 1,
        isActive: 1,
      }
    );

    // Gán thông tin về tin nhắn cuối cùng vào kết quả trả về
    const usersWithLastMessage = distinctUsers.map((user) => {
      const userInfo = usersInfo.find(
        (info) => info._id.toString() === user.userId.toString()
      );
      return {
        ...userInfo.toObject(),
        lastMessage: user.lastMessage,
        lastMessageTime: user.lastMessageTime,
      };
    });

    return {
      EM: "Get all distinct users with last messages is success!",
      EC: 0,
      DT: usersWithLastMessage,
    };
  } catch (error) {
    console.error("Error finding distinct users:", error);
    return {
      EM: "Something went wrong on the server",
      EC: 1,
      DT: [],
    };
  }
};
const retrieveMessenger = async (user) => {
  const idMessenger = user.idMessenger;
  try {
    const res = await PrivateMessenger.findOneAndUpdate(
      { idMessenger: idMessenger },
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
        select: "idMessenger sender receiver text isDeleted createdAt",
      }
    );

    if (!res) {
      console.log("Không tìm thấy tin nhắn!");
      return null;
    }
    return {
      DT: res,
      EC: 0,
    };
  } catch (error) {
    console.error("Lỗi từ server:", error);
    throw error;
  }
};
module.exports = {
  sendMessage,
  getAllChatPrivate,
  findDistinctUsers,
  retrieveMessenger,
};
