import { Message, StatusCode } from "@constant";
import { ErrorResponse } from "@models";
import { Response } from "express";

export const SuccessRes = (res: Response) => {};

export const ErrorRes = (res: Response, error: unknown) => {
  const errorData: ErrorResponse = {
    code: StatusCode.SERVER_ERROR,
    message: Message.internalServerError,
  };
  return res
    .status(StatusCode.SERVER_ERROR)
    .send({ message: Message.internalServerError, error: errorData });
};
