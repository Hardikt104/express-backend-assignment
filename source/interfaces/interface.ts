import { Response } from "express";

export interface ICreateResponse<T = any> {
    (res: Response<T>, status: number, message: string, payload: object | object[] | boolean | null | void): void;
}