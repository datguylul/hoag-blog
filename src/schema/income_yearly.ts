import { SchemaName } from "@constant";
import { IncomeYearly } from "@models";
import mongoose from "mongoose";

const IncomeYearlySchema = mongoose.model<IncomeYearly>(
  SchemaName.INCOME_YEARLY,
  new mongoose.Schema({
    date: {
      type: Date,
      required: true,
    },
    income: {
      type: Number,
      required: true,
    },
    from: {
      type: String,
    },
    note: {
      type: String,
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

export { IncomeYearlySchema };
