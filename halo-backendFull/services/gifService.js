import Gif from "../models/gif";

const getAllGif = async (group) => {
  try {
    const data = await Gif.find({}).exec();
    return {
      EM: "Get all gif is success!",
      EC: 0,
      DT: data,
    };
  } catch (error) {
    return {
      EM: "Something went wrong from the server",
      EC: 1,
      DT: [],
    };
  }
};
const addGif = async (gifArray) => {
  try {
    const formattedGifArray = gifArray.map((gif) => ({ uri: gif.uri }));
    const result = await Gif.insertMany(formattedGifArray);
    return {
      EM: "Add gif array successfully!",
      EC: 0,
      DT: result,
    };
  } catch (error) {
    return {
      EM: "Failed to add gif array",
      EC: 1,
      DT: [],
    };
  }
};
module.exports = { addGif, getAllGif };
