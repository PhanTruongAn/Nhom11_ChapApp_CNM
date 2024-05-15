import User from "../models/user";
const sendAddFriend = async (phoneSender, phoneReceiver) => {
  try {
    let sender = await User.findOne(
      { phone: phoneSender },
      "_id name phone email password avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends"
    ).exec();
    let receiver = await User.findOne({ phone: phoneReceiver }).exec();
    if (sender && receiver) {
      sender.sendFriendRequests = [...sender.sendFriendRequests, receiver];
      await sender.save();
      const { password, updatedAt, __v, ...dataSender } = sender.toObject();
      receiver.friendRequests = [...receiver.friendRequests, sender];
      await receiver.save();
      return {
        EM: "Send Add Friend Success!",
        EC: 0,
        DT: dataSender,
      };
    } else {
      return {
        EM: "Send Add Friend Error!",
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

const cancelSendAddFriend = async (phoneSender, phoneReceiver) => {
  try {
    let sender = await User.findOne(
      { phone: phoneSender },
      "_id name phone email password avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends"
    ).exec();
    let receiver = await User.findOne({ phone: phoneReceiver }).exec();
    if (sender && receiver) {
      sender.sendFriendRequests = sender.sendFriendRequests.filter(
        (item) => !item.equals(receiver._id)
      );
      await sender.save();
      const { password, updatedAt, __v, ...userData } = sender.toObject();
      receiver.friendRequests = receiver.friendRequests.filter(
        (item) => !item.equals(sender._id)
      );
      await receiver.save();
      return {
        EM: "Cancel Send Add Friend success!",
        EC: 0,
        DT: userData,
      };
    } else {
      return {
        EM: "Cancel Send Add Friend error!",
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
const cancelFriendByReceiver = async (phoneSender, phoneReceiver) => {
  try {
    let sender = await User.findOne(
      { phone: phoneSender },
      "_id name phone email password avatar sex dateOfBirth isActive friendRequests sendFriendRequests friends"
    ).exec();
    let receiver = await User.findOne({ phone: phoneReceiver }).exec();
    if (sender && receiver) {
      sender.friendRequests = sender.friendRequests.filter(
        (item) => !item.equals(receiver._id)
      );
      await sender.save();
      const { password, updatedAt, __v, ...userData } = sender.toObject();
      receiver.sendFriendRequests = receiver.sendFriendRequests.filter(
        (item) => !item.equals(sender._id)
      );
      await receiver.save();
      return {
        EM: "Cancel Add Friend success!",
        EC: 0,
        DT: userData,
      };
    } else {
      return {
        EM: "Cancel Add Friend error!",
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
const confirmAddFriend = async (phoneSender, phoneReceiver) => {
  try {
    let sender = await User.findOne({ phone: phoneSender }).exec();
    let receiver = await User.findOne({ phone: phoneReceiver }).exec();
    if (sender && receiver) {
      sender.friendRequests = sender.friendRequests.filter(
        (item) => !item.equals(receiver._id)
      );
      sender.friends = await [...sender.friends, receiver];
      await sender.save();
      const { password, updatedAt, __v, ...userData } = sender.toObject();
      receiver.sendFriendRequests = receiver.sendFriendRequests.filter(
        (item) => !item.equals(sender._id)
      );
      receiver.friends = await [...receiver.friends, sender];
      await receiver.save();
      return {
        EM: "Confirm Add Friend success!",
        EC: 0,
        DT: userData,
      };
    } else {
      return {
        EM: "Confirm Add Friend error!",
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
const deleteFriend = async (phoneSender, phoneReceiver) => {
  try {
    let sender = await User.findOne({ phone: phoneSender }).exec();
    let receiver = await User.findOne({ phone: phoneReceiver }).exec();
    if (sender && receiver) {
      sender.friends = await sender.friends.filter(
        (item) => !item.equals(receiver._id)
      );
      await sender.save();
      const { password, updatedAt, __v, ...userData } = sender.toObject();
      receiver.friends = await receiver.friends.filter(
        (item) => !item.equals(sender._id)
      );
      await receiver.save();
      return {
        EM: "cancel send addfriend is success!",
        EC: 0,
        DT: userData,
      };
    } else {
      return {
        EM: "cancel send addfriend is error!",
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
module.exports = {
  sendAddFriend,
  cancelSendAddFriend,
  cancelFriendByReceiver,
  confirmAddFriend,
  deleteFriend,
};
