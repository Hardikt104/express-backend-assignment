import { Response } from "express";
import { ICreateResponse } from "../interfaces/interface";
const createResponse = (
  res: Response,
  status: number,
  message: string,
  payload: object | Array<object> | boolean | null | void
) => {
  
  return res.status(status).json({
    status: status,
    message: message,
    data: payload,
  });
};
export default createResponse;
