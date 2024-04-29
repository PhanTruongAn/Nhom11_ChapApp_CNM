import User from "../models/user";
import GroupMessenger from "../models/groupMessenger";
import Group from "../models/group";
import mongoose from "mongoose";
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

module.exports = {
  sendMessageGroup,
  getAllChatGroup,
  retrieveMessenger,
};
