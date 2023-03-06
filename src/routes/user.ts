import { Blog } from "@schema";
import express, { Request } from "express";
import slugify from "slugify";
import joi from "@hapi/joi";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const Router = express.Router();
import { User } from "@schema";

Router.post("/user/login", async (req, res) => {
  const login_schema = joi.object({
    username: joi.string().required(),
    password: joi.string().min(6).required(),
  });
  try {
    const { error } = login_schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user = await User.findOne({ username: req.body.username });
    if (!user)
      return res
        .status(400)
        .send({ message: "username or password not correct" });

    const validpwd = await bcrypt.compare(req.body.password, user.password);
    if (!validpwd)
      return res
        .status(400)
        .send({ message: "username or password not correct" });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_TOKEN);
    // req.session.User = {
    //     id: user._id,
    //     token: token
    // }
    res.status(200).header("auth-token", token).send({
      user_id: user._id,
      token: token,
    });
    //res.status(200).send({ message: 'logged in' });
  } catch (err) {
    console.log(err);
    res.status(404).send({ message: "error" });
  }
});

Router.post("/user/signup", async (req, res) => {
  const signup_schema = joi.object({
    name: joi.string().required(),
    username: joi.string().required(),
    password: joi.string().min(6).required(),
    email: joi.string().email(),
  });
  try {
    const { error } = signup_schema.validate(req.body);
    if (error)
      return res.status(400).send({ message: error.details[0].message });

    const user_check = await User.findOne({ username: req.body.username });
    if (user_check)
      return res.status(400).send({ message: "username already taken" });

    const salt = await bcrypt.genSalt(10);
    const hashpwd = await bcrypt.hash(req.body.password, salt);

    const user = new User({
      name: req.body.name,
      username: req.body.username,
      password: hashpwd,
      email: req.body.email || "",
      phone: req.body.phone || "",
      address: req.body.address || "",
    });

    const result = await user.save();
    console.log({ user: user._id });
    if (!result) return res.status(400).send({ message: "fail" });
    res.status(200).send({ message: "success" });
  } catch (err) {
    console.log(err);
    res.status(400).send({ message: "fail", error: err });
  }
});

// Router.post('/user/logout', jwt_verify.userauth, async (req, res) => {
//     try {
//         req.session.destroy(function (err) {
//             return res.status(200).json({ status: 'success', session: 'cannot access session here' })
//         });

//     } catch (err) {
//         console.log(err);
//         res.status(400).send({ message: 'fail', error: err });
//     }
// });

export default Router;
