import { _PRODUCTS_ENDPOINT } from "../constants/api.constant";
import { ProductRequest } from "../types/request.type";
import axiosInstace from "./configAxios";

const createProductAPI = async (product: ProductRequest) => {
  try {
    const response = await axiosInstace.post(_PRODUCTS_ENDPOINT, product, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    console.log(111, response);

    return;
  } catch (error) {
    throw error;
  }
};

export {createProductAPI};
