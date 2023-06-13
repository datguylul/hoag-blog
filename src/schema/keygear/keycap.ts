import { SchemaName } from "@constant";
import { KeyCap } from "@models";
import mongoose from "mongoose";

const Blog = mongoose.model<KeyCap>(
  SchemaName.BLOG,
  new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    display_img: {
      type: String,
      default: "",
    },
    view_count: {
      type: Number,
      default: 0,
    },
    slug: {
      type: String,
      default: "",
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
    modify_date: {
      type: Date,
      default: Date.now,
    },
  })
);

export { Blog };
