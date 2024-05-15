import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://phanan:haloproject@cluster0.yw6zadw.mongodb.net/",
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      }
    );

    console.log(">>>>> Connecting to database success!");
  } catch (error) {
    console.log(">>>>> Connecting failed!");
  }
};
export default connectDB;
