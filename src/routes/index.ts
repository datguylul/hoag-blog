import express from "express";
const api = express.Router();

import blog from "./blog";
import user from "./user";
import tag from "./tag";
import income from "./income";
import { KeyCapRouter } from "./keygear";

api.use("/blog", blog);
api.use("/v1/user", user);
api.use("/tag", tag);
api.use("/income", income);
api.use("/v1/keycap", KeyCapRouter);

export { api };
