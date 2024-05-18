// // User Registry
import User from "../models/user";
import Group from "../models/group";
import GroupMessenger from "../models/groupMessenger";
import mongoose from "mongoose";
const GetInFoUsersById = async (arr) => {
  let list = [];
  if (arr && arr.length > 0) {
    for (let i = 0; i < arr.length; i++) {
      let user = await User.findById(
        arr[i],
        "_id name phone email avatar"
      ).exec();
      list.push(user);
    }
  }
  return list;
};

const CreateNewGroup = async (data) => {
  try {
    let members = await GetInFoUsersById(data.members);
    let author = await User.findById(
      data.authorId,
      "_id name phone email avatar"
    ).exec();
    const res = await Group.create({
      author: author,
      name: data.groupName,
      members,
    });
    return {
      EM: "create new group is success!",
      EC: 0,
      DT: res,
    };
  } catch (error) {
    console.log("server " + error);
    return {
      EM: "something wrong from server",
      EC: 1,
      DT: [],
    };
  }
};
const AddMembersToGroup = async (data) => {
  try {
    const items = data.members;
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: data._id },
      { $push: { members: { $each: items } } },
      { new: true }
    )
      .populate("author", "_id name phone email avatar")
      .populate("members", "_id name phone email avatar")
      .exec();

    return {
      EM: "Add members successfully!",
      EC: 0,
      DT: updatedGroup,
    };
  } catch (error) {
    return {
      EM: "Error from server!",
      EC: 1,
    };
  }
};

const GetAllGroupByUserId = async (data) => {
  try {
    let groups = await Group.find({
      $or: [{ author: data._id }, { members: { $in: [data._id] } }],
    })
      .populate("author", "_id name phone email avatar")
      .populate("members", "_id name phone email avatar")
      .exec();
    if (groups && groups.length > 0) {
      return {
        EM: "get groups by id success!",
        EC: 0,
        DT: groups,
      };
    }
    return {
      EM: "No group found for the given user id!",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log("server " + error);
    return {
      EM: "something wrong from server",
      EC: 1,
      DT: [],
    };
  }
};
const GetAllGroupsWithLatestMessage = async (data) => {
  try {
    const res = await GetAllGroupByUserId(data);
    const groups = res.DT;

    if (groups && groups.length > 0) {
      let arr = await Promise.all(
        groups.map(async (item, index) => {
          let data = await GroupMessenger.find({
            group: new mongoose.Types.ObjectId(item._id),
          })

            .sort({ createdAt: "desc" })
            .populate("sender")
            .populate({
              path: "group",
              populate: {
                path: "author members",
                select: "_id name phone email avatar",
              },
            })
            // .limit(1)
            .exec();

          if (data && data.length > 0) {
            return data[0];
          } else {
            return {};
          }
        })
      );
      return {
        EM: "Get message final of group is success!",
        EC: 0,
        DT: arr,
      };
    }
    return {
      EM: "Get message final of group is error!",
      EC: 0,
      DT: [],
    };
  } catch (error) {
    console.log("Error: ", error);
  }
};
const DeleteMembersFromGroup = async (data) => {
  try {
    const item = data.member._id;
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: data._id },
      { $pull: { members: item } },
      { new: true }
    )
      .populate("author", "_id name phone email avatar")
      .populate("members", "_id name phone email avatar")
      .exec();

    return {
      EM: "Delete members successfully!",
      EC: 0,
      DT: updatedGroup,
    };
  } catch (error) {
    return {
      EM: "Error from server!",
      EC: 1,
    };
  }
};
const DeleteGroupById = async (data) => {
  const _id = data._id;
  try {
    const deletedGroup = await Group.findByIdAndDelete(_id);
    if (deletedGroup) {
      return {
        EM: "Delete group by id success!",
        EC: 0,
        DT: {},
      };
    }
    return {
      EM: "No group found for the given id!",
      EC: 0,
      DT: null,
    };
  } catch (error) {
    console.log("server " + error);
    return {
      EM: "Something went wrong on the server",
      EC: 1,
      DT: null,
    };
  }
};
const LeaderLeaveGroup = async (data) => {
  try {
    const item = data.member;
    const updatedGroup = await Group.findOneAndUpdate(
      { _id: data._id },
      { $pull: { members: item }, $set: { author: item } },
      { new: true }
    )
      .populate("author", "_id name phone email avatar")
      .populate("members", "_id name phone email avatar")
      .exec();

    return {
      EM: "Delete members successfully!",
      EC: 0,
      DT: updatedGroup,
    };
  } catch (error) {
    return {
      EM: "Error from server!",
      EC: 1,
    };
  }
};
const updateAvatarGroup = async (data) => {
  try {
    const _id = data._id;
    const newAvatarUri = data.avatar.uri;
    const updatedGroup = await Group.findByIdAndUpdate(
      _id,
      { "avatar.uri": newAvatarUri },
      { new: true }
    );
    if (updatedGroup) {
      return {
        EM: "Update avatar group successfully!",
        EC: 0,
        DT: updatedGroup,
      };
    } else {
      return {
        EM: "No group found for the given id!",
        EC: 0,
        DT: null,
      };
    }
  } catch (error) {
    console.log("Error updating avatar group: ", error);
    return {
      EM: "Something went wrong on the server",
      EC: 1,
      DT: null,
    };
  }
};
module.exports = {
  CreateNewGroup,
  GetAllGroupByUserId,
  AddMembersToGroup,
  DeleteMembersFromGroup,
  DeleteGroupById,
  GetAllGroupsWithLatestMessage,
  LeaderLeaveGroup,
  updateAvatarGroup,
};
