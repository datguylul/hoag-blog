import mongoose from "mongoose";
const mongooseConnect = () => {
  console.log("MongooseDB connecting...");
  mongoose.connect(
    process.env.MONGO_URL ?? "",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log("MongooseDB connect failed", err);
      else console.log("MongooseDB connected");
    }
  );
};

export { mongooseConnect };
