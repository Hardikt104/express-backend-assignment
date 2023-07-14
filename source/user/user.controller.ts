import { Request, Response } from "express";
import httpStatus from "http-status";
import userService from "./user.service";
import createResponse from "../utils/response";
import Messages from "../utils/messages";

/**
 * 
 * @param req 
 * @param res 
 */
const getRandomUser = async (req: Request, res: Response) => {
    try {
        const getRandomUser = await userService.getRandomUser()
        createResponse(res, httpStatus.OK, Messages.GET_RANDOM_USER_SUCCESSFULLY, getRandomUser);
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }

}
export default { getRandomUser }