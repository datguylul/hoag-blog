import express from "express";
const api = express.Router();

import blog from "./blog";
import user from "./user";
import tag from "./tag";
import income from "./income";

api.use("/blog", blog);
api.use("/user", user);
api.use("/tag", tag);
api.use("/income", income);

export { api };
