import mongoose from "mongoose";
const mongooseConnect = () => {
  mongoose.connect(
    process.env.MONGO_URL ?? "",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log("MongooseDB connect failed");
      else console.log("MongooseDB connected");
    }
  );
};

export { mongooseConnect };
