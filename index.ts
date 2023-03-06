require("module-alias/register");
require("dotenv").config();
import express from "express";
const app = express();
import session from "express-session";
import body_parser from "body-parser";
import cors from "cors";

import api_routes from "@routes/api_routes";
import { mongooseConnect } from "@mongoose";

app.use(
  session({
    resave: true,
    saveUninitialized: true,
    secret: "hoag",
    cookie: { maxAge: 365 * 24 * 60 * 60 * 1000 },
  })
);

app.use(cors());
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));

app.use("/api", api_routes);

app.get("/test", (req, res) => {
  res.json({
    hello: "world",
  });
});

app.get("*", async (_, res) => {
  res.status(404);
  res.send({
    error: "Not Found",
  });
});

mongooseConnect();

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`running at: ${port}`);
});
