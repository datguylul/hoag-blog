require("module-alias/register");
require("dotenv").config();
import express from "express";
const app = express();
import session from "express-session";
import body_parser from "body-parser";
import cors from "cors";

import { api } from "@routes";
import { mongooseConnect } from "@mongoose";
import { notFound, swaggerDocs } from "@utils";

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

app.use("/api", api);

const port = process.env.PORT || 3000;

app.listen(port, () => {
  mongooseConnect();

  swaggerDocs(app, port as number);

  notFound(app);

  console.log(`running at: ${port}`);
});
