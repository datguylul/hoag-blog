import { Message, StatusCode } from "@constant";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(StatusCode.UNAUTHORIZE)
      .send({ message: Message.auth.tokenEmpty });

  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN ?? "");
    // req.user = verified;

    console.log("verified", verified);

    next();
  } catch (err) {
    console.log("auth-err", err);

    res
      .status(StatusCode.UNAUTHORIZE)
      .send({ message: Message.auth.invalidToken });
  }
};
