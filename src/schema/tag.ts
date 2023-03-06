import { SchemaName } from "@constant";
import mongoose from "mongoose";

const Tag = mongoose.model(
  SchemaName.TAG,
  new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
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

export { Tag };
