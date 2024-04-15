import chatService from "../services/chatService";

const handlerSendMessenger = async (req, res) => {
  try {
    let data = await chatService.sendMessage(req.body);
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
const handlerGetAllChatPrivate = async (req, res) => {
  try {
    let data = await chatService.getAllChatPrivate(req.body);
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
const handlerGetAllConversation = async (req, res) => {
  try {
    let data = await chatService.findDistinctUsers(req.body);
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
    let data = await chatService.retrieveMessenger(req.body);
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
module.exports = {
  handlerSendMessenger,
  handlerGetAllChatPrivate,
  handlerGetAllConversation,
  handlerRetrieveMessenger,
};
