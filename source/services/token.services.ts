import moment from "moment";
import jwt from "jsonwebtoken";
import httpStatus from 'http-status';
import { Types } from 'mongoose';

import constant from "./../config/constant"
import config from './../config/config'
import Tokens from '../models/documets/token.documet';
import AppError from '../utils/AppError';

const generateToken = (user: Types.ObjectId, expires: { unix: () => any; }, secret = config.jwt.secret) => {
  const payload = {
    sub: { user },
    iat: moment().unix(),
    exp: expires.unix()
  };
  return jwt.sign(payload, secret);
};
const saveToken = async (token: any, userId: Types.ObjectId, expires: moment.Moment, type: any, blacklisted = false) => {
  const tokenDoc = await Tokens.create({
    token,
    user: userId,
    expiresAt: expires.toDate(),
    type,
    blacklisted,
  });
  return tokenDoc;
};
const generateAuthTokens = async (userId: Types.ObjectId) => {
  const accessTokenExpires = moment().add(config.jwt.accessExpirationMinutes, 'minutes');
  const accessToken = generateToken(userId, accessTokenExpires);
  const refreshTokenExpires = moment().add(config.jwt.refreshExpirationDays, 'days');
  const refreshToken = generateToken(userId, refreshTokenExpires);
  await saveToken(refreshToken, userId, refreshTokenExpires, constant.TOKEN_TYPE.REFRESH_TOKEN);

  return {
    access: {
      token: accessToken,
      expires: accessTokenExpires.toDate(),
    },
    refresh: {
      token: refreshToken,
      expires: refreshTokenExpires.toDate(),
    },
  };
};

const verifyToken = async (token: any, type: any) => {
  const payload: any = jwt.verify(token, config.jwt.secret);
  const tokenDoc: any = await Tokens.findOne({ token, type, user: payload.sub.user._id });
  if (!tokenDoc) {
    throw new AppError(httpStatus.NOT_FOUND, 'The link has been expired!');
  }
  return payload;
};
export default {
  generateAuthTokens,
  verifyToken,
}