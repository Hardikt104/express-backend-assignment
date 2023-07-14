import axios from "axios";
import httpStatus from "http-status";

import AppError from "../utils/AppError";

/**
 * Get call from Axios
 */
const axiosGet = async (url: string, payload = {}) => {
  const params = new URLSearchParams(payload).toString();
  try {
    return await axios.get(`${url}?${params}`);
  } catch (error: any) {
    console.log("error",error)
    throw new AppError(httpStatus.UNPROCESSABLE_ENTITY, error.message);
  }
};

export {
  axiosGet,
};
