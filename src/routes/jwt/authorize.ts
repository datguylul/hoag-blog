import { Message, StatusCode } from "@constant";
import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
export interface AuthPayload extends Request {
  userId: { _id: string } | string | JwtPayload;
}

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");
  if (!token)
    return res
      .status(StatusCode.UNAUTHORIZE)
      .send({ message: Message.auth.tokenEmpty });

  try {
    const verified = jwt.verify(token, process.env.JWT_TOKEN ?? "");
    (req as AuthPayload).userId = verified;

    next();
  } catch (err) {
    console.log("auth-err", err);

    res
      .status(StatusCode.UNAUTHORIZE)
      .send({ message: Message.auth.invalidToken });
  }
};
