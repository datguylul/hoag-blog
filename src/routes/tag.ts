import { Tag } from "@schema";
import express from "express";
import slugify from "slugify";
import { auth } from "./jwt/authorize";
import joi from "joi";
import { Message, StatusCode } from "@constant";
import { isEmpty } from "lodash";
import { ErrorRes, SuccessRes } from "@utils";

const Router = express.Router();

Router.get("/test", auth, async (req, res) => {
  res.status(200);
  res.send({ tag: "tag test ok" });
});

Router.get("/list", async (req, res) => {
  try {
    const pageIndex = parseInt(req.body.pageIndex as string) ?? 1;
    const pageSize = parseInt(req.query.pageSize as string) ?? 10;
    const list = await Tag.find()
      .skip(pageIndex > 0 ? (pageIndex - 1) * pageSize : 0)
      .limit(pageSize);

    res.send({ tags: list });
  } catch (err) {
    ErrorRes(res, err);
  }
});

Router.get("/detail/:id", async (req, res) => {
  try {
    const tag = await Tag.findOne({ _id: req.params.id });

    if (isEmpty(tag)) {
      return res.status(StatusCode.BAD_REQUEST).send({ message: "Not found" });
    }

    res.send({ tag: tag });
  } catch (err) {
    console.log(err);

    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError });
  }
});

Router.post("/", async (req, res) => {
  const createTag = joi.object({
    name: joi.string().required(),
  });
  try {
    const { error } = createTag.validate(req.body);
    if (error)
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: error.details[0].message });

    const slug = slugify(req.body.name, { lower: true, strict: true });
    const tag = new Tag({
      name: req.body.name,
      slug: slug,
    });

    const result = await tag.save();

    res.status(StatusCode.OK).send({ tag: result });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError });
  }
});

Router.put("/:id", async (req, res) => {
  try {
    const slug = slugify(req.body.name, { lower: true, strict: true });
    const result = await Tag.updateOne(
      { _id: req.params.id },
      {
        $set: {
          name: req.body.name,
          slug: slug,
        },
      }
    );
    res.send({ tag: result });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError });
  }
});

Router.delete("/:id", async (req, res) => {
  try {
    const result = await Tag.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (err) {
    console.log(err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError });
  }
});

export default Router;
