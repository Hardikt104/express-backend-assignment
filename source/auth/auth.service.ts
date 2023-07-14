import bcrypt from "bcryptjs";
import httpStatus from "http-status";
import mongoose from 'mongoose';

import { ICreateUser, ILoginUser } from "./auth.interface"
import User from "../models/documets/user.documet";
import AppError from "../utils/AppError";
import Messages from "../utils/messages";
import IuserModel from "../models/interfaces/user.interface";

/**
 * 
 * @param email (check if system have same email address)
 */
const checkDuplicateEmail = async (email: string) => {
    const getUser = await User.findOne({ email });
    if (getUser) {
        throw new AppError(httpStatus.BAD_REQUEST, Messages.EMAIL_TAKEN);
    }
};

/**
 * 
 * @param password (password requested by user)
 * @param curruntPassword (password stored in database)
 * this function is use for check password
 */
const checkPassword = async (password: string, curruntPassword: string) => {
    const isPasswordMatch = await bcrypt.compare(password, curruntPassword);
    if (!isPasswordMatch) {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.PASSWORD_INCORRECT);
    }
};

/**
 * 
 * @param data (create user parameters)
 * @returns (user details that database have saved)
 */
const createUser = async (data: ICreateUser): Promise<IuserModel> => {
    await checkDuplicateEmail(data?.email?.toLowerCase());
    data.password = await bcrypt.hash(data.password, 8);
    return await User.create({
        email: data?.email?.toLowerCase(),
        password: data.password
    },
    )
}

/**
 * 
 * @param data (getting login user parameters)
 * @returns (user details)
 */
const login = async (data: ILoginUser): Promise<IuserModel> => {
    let user = await User.findOne({ email: data?.email?.toLowerCase() })
    if (user) {
        await checkPassword(data.password, user.password);
        return user
    }
    else {
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.EMAIL_NOT_FOUND)
    }
}

/**
 * 
 * @param id (authorized user id)
 * @returns (user details)
 */
const getUser = async (id: string):Promise<IuserModel> => {
    const user = await User.findOne({ _id: new mongoose.Types.ObjectId(id) })
    if(!user){
        throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, Messages.USER_NOT_EXIST)
    }
    return user;
}

export default { createUser, login, getUser }