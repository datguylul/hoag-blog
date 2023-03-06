import { SchemaName } from "@constant";
import mongoose from "mongoose";

const Header = mongoose.model(
  SchemaName.HEADER_MENU,
  new mongoose.Schema({
    id: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    link: {
      type: String,
      required: true,
    },
    active: {
      type: Boolean,
      default: false,
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

export { Header };
