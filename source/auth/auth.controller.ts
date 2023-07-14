import { Request, Response } from "express";
import httpStatus from "http-status";
import { Types } from 'mongoose';

import authService from "../auth/auth.service";
import createResponse from "./../utils/response";
import { ICreateUser, ILoginUser } from "./auth.interface";
import Messages from "../utils/messages";
import tokenServices from "../services/token.services";

/**
 * 
 * @param req 
 * @param res 
 * This function is used for passing requested parameters for the creation of a user.
 */
const userCreate = async (req: Request, res: Response) => {
    try {
        const createUser = await authService.createUser(req.body as ICreateUser)
        createResponse(res, httpStatus.OK, Messages.USER_CREATE_SUCCESS, createUser);
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
}

/**
 * 
 * @param req 
 * @param res 
 * This function is used for user login and generate auth token.
 */
const login = async (req: Request, res: Response) => {
    try {
        const user = await authService.login(req.body as ILoginUser)
        const tokens = await tokenServices.generateAuthTokens(
            user._id as Types.ObjectId,
        );
        createResponse(res, httpStatus.OK, Messages.LOGIN, { user, tokens });
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
}

/**
 * 
 * @param req 
 * @param res 
 * This function is used for get user profile/detail.
 */
const userProfile = async (req: Request, res: Response) => {
    try {
        const getUser = await authService.getUser(req.loggedInUser.id as string)
        createResponse(res, httpStatus.OK, Messages.GET_USER_SUCCESS, getUser);
    } catch (error: any) {
        createResponse(res, httpStatus.BAD_REQUEST, error.message, {});
    }
}

export default {
    userCreate,
    login,
    userProfile
}