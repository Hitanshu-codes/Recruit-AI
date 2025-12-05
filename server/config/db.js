import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config();
// function to connect to mongodb database
const connectDB = async () => {
  mongoose.connection.on("connected", () => {
    console.log("Mongoose is connected");
  })
  try {
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log("Database connected");
  } catch (error) {
    console.log(error);
  }
}

export default connectDB