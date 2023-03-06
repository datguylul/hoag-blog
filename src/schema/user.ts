import { SchemaName } from "@constant";
import mongoose from "mongoose";

const User = mongoose.model(
  SchemaName.USER,
  new mongoose.Schema({
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      default: "",
    },
    phone: {
      type: String,
      default: "",
    },
    created_date: {
      type: Date,
      default: Date.now,
    },
  })
);

export { User };
