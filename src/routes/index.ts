import express from "express";
const api = express.Router();

import blogRoute from "./blog";
import userRoute from "./user";

api.use("/blog", blogRoute);
api.use("/user", userRoute);

export { api };
