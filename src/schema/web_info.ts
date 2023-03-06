import { SchemaName } from "@constant";
import mongoose from "mongoose";

const WebInfo = mongoose.model(
  SchemaName.WEB_INFO,
  new mongoose.Schema({
    linkedin_link: {
      type: String,
      default: "",
    },
    google_link: {
      type: String,
      required: true,
    },
    twitter_link: {
      type: String,
      default: "",
    },
  })
);

export { WebInfo };
