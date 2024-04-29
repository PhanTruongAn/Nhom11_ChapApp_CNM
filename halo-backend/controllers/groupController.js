import groupService from "../services/groupService";
import groupChatService from "../services/groupChatService";
const handlerCreateNewGroup = async (req, res) => {
  try {
    let data = await groupService.CreateNewGroup(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerGetAllGroup = async (req, res) => {
  try {
    let data = await groupService.GetAllGroupByUserId(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerAddMembers = async (req, res) => {
  try {
    let data = await groupService.AddMembersToGroup(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerDeleteMembers = async (req, res) => {
  try {
    let data = await groupService.DeleteMembersFromGroup(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerDeleteMGroup = async (req, res) => {
  try {
    let data = await groupService.DeleteGroupById(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerSendMessGroup = async (req, res) => {
  try {
    let data = await groupChatService.sendMessageGroup(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerGetAllChatGroup = async (req, res) => {
  try {
    let data = await groupChatService.getAllChatGroup(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerRetrieveMessenger = async (req, res) => {
  try {
    let data = await groupChatService.retrieveMessenger(req.body);
    return res.status(200).json({
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
const handlerGetAllGroupsWithLatestMessage = async (req, res) => {
  try {
    let data = await groupService.GetAllGroupsWithLatestMessage(req.body);
    return res.status(200).json({
      EM: data.EM,
      EC: data.EC,
      DT: data.DT,
    });
  } catch (error) {
    console.log("server " + error);
    return res.status(500).json({
      EM: "error from sever",
      EC: "-1",
      DT: "",
    });
  }
};
module.exports = {
  handlerCreateNewGroup,
  handlerGetAllGroup,
  handlerAddMembers,
  handlerDeleteMembers,
  handlerDeleteMGroup,
  handlerSendMessGroup,
  handlerGetAllChatGroup,
  handlerRetrieveMessenger,
  handlerGetAllGroupsWithLatestMessage,
};
