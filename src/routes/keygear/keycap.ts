import express from "express";

const Router = express.Router();

export const KeyCapRouter = Router.get("/test", async (req, res) => {
  res.status(200);
  res.send({ tag: "tag test ok" });
});
