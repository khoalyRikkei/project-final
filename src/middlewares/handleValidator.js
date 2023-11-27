const validationProduct = (req, res, next) => {
  const product = { ...req.body };

  let error = {};

  if (!product.name) {
    error.msgName = "Name is required";
  }

  if (!product.price) {
    error.msgPrice = "Price is required";
  }

  if (!product.imageUrl) {
    error.msgImageUrl = "Upload image failed";
  }

  if (Object.keys(error).length !== 0) {
    return next(error);
  }

  next();
};

export {
    validationProduct
}
