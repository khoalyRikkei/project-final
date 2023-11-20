import { verifyToken } from "../utils/jwt.js";

export const isAuth = (req, res, next) => {
  console.log(req.headers);
  const authorization = req.headers["authorization"];

  const token = authorization.split(" ")[1];

  if (token) {
    try {
      const decode = verifyToken(token);
      req.userId = decode.id;
      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          auth: "Token is expired or invalid",
        },
      });
    }
  }

  return res.status(401).json({
    message: "Unauthorized",
    errors: {
      auth: "Token is invalid",
    },
  });
};
export const isAdmin = (req, res, next) => {
  console.log(req.headers);
  const authorization = req.headers["authorization"];

  const token = authorization.split(" ")[1];

  if (token) {
    try {
      const decode = verifyToken(token);
      if (decode.role != 1) {
        return res.status(401).json({
          message: "Unauthorized",
          errors: {
            auth: "Token is expired or invalid",
          },
        });
      }
      return next();
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          auth: "You not authorized to access this",
        },
      });
    }
  }

  return res.status(401).json({
    message: "Unauthorized",
    errors: {
      auth: "Token is invalid",
    },
  });
};
