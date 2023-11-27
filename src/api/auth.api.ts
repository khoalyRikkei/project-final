import { _LOGIN_API } from "../constants/api.constant";
import { LoginRequest } from "../types/request.type";

import axiosInstace from "./configAxios";

// API function to handle login
const loginApi = async (userLogin: LoginRequest) => {
  try {
    const response = await axiosInstace.post(_LOGIN_API, userLogin);
    const userData = response.data;
    const token = response.headers["Authorization"];
    return {
      userData,
      token,
    };
  } catch (error) {
    throw error;
  }
};

export { loginApi };
