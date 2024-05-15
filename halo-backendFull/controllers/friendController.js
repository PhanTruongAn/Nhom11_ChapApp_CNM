import friendService from "../services/friendServices";
const sendAddFriend = async (req, res) => {
  try {
    let data = await friendService.sendAddFriend(
      req.body.phoneSender,
      req.body.phoneReceiver
    );
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
const cancelSendAddFriend = async (req, res) => {
  try {
    let data = await friendService.cancelSendAddFriend(
      req.body.phoneSender,
      req.body.phoneReceiver
    );
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
const cancelFriendByReceiver = async (req, res) => {
  try {
    let data = await friendService.cancelFriendByReceiver(
      req.body.phoneSender,
      req.body.phoneReceiver
    );
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
const confirmAddFriend = async (req, res) => {
  try {
    let data = await friendService.confirmAddFriend(
      req.body.phoneSender,
      req.body.phoneReceiver
    );
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
const deleteFriend = async (req, res) => {
  try {
    let data = await friendService.deleteFriend(
      req.body.phoneSender,
      req.body.phoneReceiver
    );
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
  sendAddFriend,
  deleteFriend,
  confirmAddFriend,
  cancelFriendByReceiver,
  cancelSendAddFriend,
};
