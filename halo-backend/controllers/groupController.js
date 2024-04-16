import groupService from "../services/groupService";

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
module.exports = {
  handlerCreateNewGroup,
  handlerGetAllGroup,
  handlerAddMembers,
};
