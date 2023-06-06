import { Message, MongooseDateFormat, StatusCode } from "@constant";
import { PagingData } from "@models";
import { IncomeYearlySchema } from "@schema";
import dayjs from "dayjs";
import express from "express";
import joi from "joi";

const Router = express.Router();

Router.get("/", async (req, res) => {
  try {
    const pageIndex = parseInt(req.query.pageIndex as string) ?? 1;
    const pagesize = parseInt(req.query.pageSize as string) ?? 10;
    const date_sort = req.query.date_sort || -1;

    const total = await IncomeYearlySchema.count();
    const list = await IncomeYearlySchema.find()
      .sort({ created_date: date_sort })
      .skip(pageIndex > 0 ? (pageIndex - 1) * pagesize : 0)
      .limit(pagesize);

    const data: PagingData = {
      data: list,
      total: total,
    };

    res.send(data);
  } catch (err) {
    console.log(err);
  }
});

Router.post("/add-new", async (req, res) => {
  const createTag = joi
    .object({
      date: joi.date().required(),
      income: joi.number().required(),
    })
    .options({ stripUnknown: true });
  try {
    const { error } = createTag.validate(req.body);
    if (error)
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: error.details[0].message });

    const income = new IncomeYearlySchema({
      date: req.body.date,
      income: req.body.income,
      note: req.body.note,
      from: req.body.from,
    });

    const result = await income.save();

    res.status(StatusCode.OK).send({ income: result });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError });
  }
});

Router.get("/sum", async (req, res) => {
  const createTag = joi
    .object({
      date: joi.date(),
    })
    .options({ stripUnknown: true });
  try {
    const { error } = createTag.validate(req.body);
    if (error)
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: error.details[0].message });

    const startMonth = dayjs(req.body.date)
      .startOf("month")
      .format(MongooseDateFormat);
    const endMonth = dayjs(req.body.date)
      .endOf("month")
      .format(MongooseDateFormat);

    const data = await IncomeYearlySchema.find({
      date: {
        $gte: startMonth,
        $lte: endMonth,
      },
    });

    const sum = await IncomeYearlySchema.aggregate([
      {
        $match: {
          date: {
            $gte: endMonth,
            $lte: startMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          total: {
            $sum: "$income",
          },
        },
      },
      { $unset: ["_id"] },
    ]);

    res.status(StatusCode.OK).send({ incomes: data, sum: sum });
  } catch (err) {
    console.log(err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError });
  }
});

export default Router;
