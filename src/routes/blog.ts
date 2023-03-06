import { Blog } from "@schema";
import express from "express";
import slugify from "slugify";

const Router = express.Router();

Router.get("/test", async (req, res) => {
  res.status(200);
  res.send({ blog: "blog test ok" });
});

Router.get("/", async (req, res) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string) ?? 1;
    const pagesize = parseInt(req.query.pageSize as string) ?? 10;
    const date_sort = req.query.date_sort || -1;

    const list = await Blog.find()
      .sort({ created_date: date_sort })
      .skip(pageIndex > 0 ? (pageIndex - 1) * pagesize : 0)
      .limit(pagesize);

    res.send(list);
  } catch (err) {
    console.log(err);
  }
});

Router.get("/:slug", async (req, res) => {
  try {
    const blog = await Blog.find({ slug: req.params.slug });

    res.send(blog);
  } catch (err) {
    console.log(err);
  }
});

Router.post("/", async (req, res) => {
  try {
    // const blog = new Blog({
    //     title: "Money Money",
    //     alt_title: "Money n shjt",
    //     content: "blank",
    //     display_img: "img here"
    // });
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const blog = new Blog({
      title: req.body.title,
      alt_title: req.body.alt_title,
      content: req.body.content,
      display_img: req.body.display_img,
      tags_id: req.body.tags,
      slug: slug,
      // author_id: req.session.userid,
    });

    const result = await blog.save();

    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

Router.put("/:id", async (req, res) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const result = await Blog.updateOne(
      { _id: req.params.id },
      {
        $set: {
          title: req.body.title,
          alt_title: req.body.alt_title,
          content: req.body.content,
          display_img: req.body.display_img,
          slug: slug,
          tags_id: req.body.tags,
          modify_date: Date.now(),
        },
      }
    );
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

Router.delete("/:id", async (req, res) => {
  try {
    const result = await Blog.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (err) {
    console.log(err);
  }
});

export default Router;
