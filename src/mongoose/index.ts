import mongoose from "mongoose";
const mongooseConnect = () => {
  mongoose.connect(
    process.env.MONGO_URL ?? "",
    { useNewUrlParser: true, useUnifiedTopology: true },
    (err) => {
      if (err) console.log("db connect fail");
      else console.log("db connected");
    }
  );
};

export { mongooseConnect };
