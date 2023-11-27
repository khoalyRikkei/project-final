import { createProductAPI } from "../api/product.api";
import { ProductRequest } from "../types/request.type";

const createProductService = async (product: ProductRequest) => {
  try {
    createProductAPI(product);
  } catch (error) {
    console.log("server error: ", error);
  }
};

export { createProductService };
