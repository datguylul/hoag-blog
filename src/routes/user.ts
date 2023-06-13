import express from "express";
import joi from "joi";
import jwt from "jsonwebtoken";
import { isEmpty } from "lodash";
import { User } from "@schema";
import { Message, StatusCode } from "@constant";
import { MD5String } from "@utils";
import { UserInfo } from "@models";
import { auth, AuthPayload } from "./jwt/authorize";

const Router = express.Router();

/**
 * @openapi
 * '/api/v1/user/login':
 *  post:
 *     tags:
 *     - User
 *     summary: User login
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *                phone:
 *              required:
 *               - username
 *               - password
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
Router.post("/login", async (req, res) => {
  const login_schema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(6).required(),
  });
  try {
    const { error } = login_schema.validate(req.body);
    if (error)
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: error.details[0].message });
    const hashPwd = MD5String(req.body.password);

    const user = await User.findOne(
      { username: req.body.username, password: hashPwd },
      { password: 0 }
    );

    if (isEmpty(user))
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: Message.login.namePassNotCorrect });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN ?? "");
    res.status(StatusCode.OK).header("auth-token", token).send({
      user: user,
      token: token,
    });
  } catch (err) {
    console.log("login", err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError });
  }
});

/**
 * @openapi
 * '/api/v1/user/sign-up':
 *  post:
 *     tags:
 *     - User
 *     summary: User sign up
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                username:
 *                  type: string
 *                password:
 *                  type: string
 *                email:
 *                  type: string
 *                phone:
 *                  type: string
 *              required:
 *               - name
 *               - username
 *               - password
 *     responses:
 *      200:
 *        description: Success
 *      400:
 *        description: Bad request
 */
Router.post("/sign-up", async (req, res) => {
  const signup_schema = joi.object({
    name: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().min(6).required(),
    email: joi.string().email().required(),
    phone: joi
      .string()
      .length(10)
      .pattern(/^[0-9]+$/)
      .required(),
  });
  try {
    const { error } = signup_schema.validate(req.body);
    if (error)
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: error.details[0].message });

    const user_check = await User.findOne(
      { username: req.body.username },
      { password: 0 }
    );
    if (user_check)
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: Message.signUp.userNameTaken });

    const user: UserInfo = {
      name: req.body.name,
      username: req.body.username,
      password: MD5String(req.body.password),
      email: req.body.email || "",
      phone: req.body.phone || "",
      address: req.body.address || "",
      created_date: Date.now(),
    };

    const result = await new User(user).save();
    if (!result)
      return res.status(StatusCode.BAD_REQUEST).send({ message: "fail" });

    delete user.password;
    res.status(StatusCode.OK).send({ user: user, message: "success" });
  } catch (err) {
    console.log("sign-up", err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError, error: err });
  }
});

Router.get("/list", auth, async (req, res) => {
  try {
    const pageIndex = parseInt(req.body.pageIndex as string) ?? 1;
    const pageSize = parseInt(req.query.pageSize as string) ?? 10;
    const date_sort = req.query.date_sort || -1;

    const list = await User.find()
      .sort({ created_date: date_sort })
      .skip(pageIndex > 0 ? (pageIndex - 1) * pageSize : 0)
      .limit(pageSize);

    res.status(StatusCode.OK).send({ user: list, message: "success" });
  } catch (err) {
    console.log("detail-error", err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError, error: err });
  }
});

Router.get("/detail", auth, async (req, res) => {
  try {
    const user = await User.findOne(
      { username: req.body.username },
      { password: 0 }
    );

    console.log("req", (req as AuthPayload).userId);

    if (isEmpty(user))
      return res
        .status(StatusCode.BAD_REQUEST)
        .send({ message: Message.user.userNotFound });

    res.status(StatusCode.OK).send({ user: user, message: "success" });
  } catch (err) {
    console.log("detail-error", err);
    res
      .status(StatusCode.SERVER_ERROR)
      .send({ message: Message.internalServerError, error: err });
  }
});

// Router.post("/logout", jwt_verify.userauth, async (req, res) => {
//   try {
//     req.session.destroy(function (err) {
//       return res
//         .status(StatusCode.OK)
//         .json({ status: "success", session: "cannot access session here" });
//     });
//   } catch (err) {
//     console.log(err);
//     res
//       .status(StatusCode.SERVER_ERROR)
//       .send({ message: Message.internalServerError, error: err });
//   }
// });

export default Router;
