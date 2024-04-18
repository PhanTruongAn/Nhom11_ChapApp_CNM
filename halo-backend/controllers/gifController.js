import gifService from "../services/gifService";
const handlerGetAllGif = async (req, res) => {
  try {
    let data = await gifService.getAllGif(req.body);
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
const handlerAddGif = async (req, res) => {
  try {
    let data = await gifService.addGif(req.body);
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

module.exports = { handlerAddGif, handlerGetAllGif };
