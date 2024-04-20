import User from "../models/user";
import GroupMessenger from "../models/groupMessenger";
import Group from "../models/group";
const sendMessageGroup = async (data) => {
  try {
    let sender = await User.findById(data.sender).exec();
    let group = await Group.findById(data.groupId).exec();
    if (sender && group && data.text) {
      const chat = new GroupMessenger({
        idMessenger: data.idMessenger,
        sender: sender,
        group: group,
        text: data.text,
        receiver: data.receiver,
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
const getAllChatGroup = async (group) => {
  try {
    const data = await GroupMessenger.find({ group: group.groupId })
      // .sort({ createdAt: "desc" })
      // .limit(3)
      .populate("sender", "_id name phone email avatar.uri avatar.color")
      .exec();
    return {
      EM: "Get all messenger is success!",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    return {
      EM: "something wrong from server",
      EC: 1,
      DT: [],
    };
  }
};
const retrieveMessenger = async (user) => {
  const idMessenger = user.idMessenger;

  try {
    const res = await GroupMessenger.findOneAndUpdate(
      { idMessenger: idMessenger },
      {
        $set: {
          isDeleted: true,
        },
      },
      {
        new: true,
        select: "idMessenger receiver text group isDeleted createdAt", // Loại bỏ trường "sender" ở đây
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
module.exports = {
  sendMessageGroup,
  getAllChatGroup,
  retrieveMessenger,
};
