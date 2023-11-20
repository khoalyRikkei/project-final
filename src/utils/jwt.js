import jwt from "jsonwebtoken";

const createToken = (data) => {
  // data là object --> {userId, role}

  // secret nên tạo trong env
  return jwt.sign(
    data,
    "mabaomat",
    { algorithm: "HS384" },
    { expiresIn: "10m" }
  );
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, "mabaomat");
    return decoded;
  } catch (err) {
    throw err;
    // err
  }
};

const createAccessToken = (data) => {
  // data là object --> {userId, role}

  // secret nên tạo trong env
  return jwt.sign(
    data,
    "accessToken",
    { algorithm: "HS384" },
    { expiresIn: "1m" }
  );
};

const createRefreshToken = (data) => {
  // data là object --> {userId, role}

  // secret nên tạo trong env
  return jwt.sign(
    data,
    "refreshToken",
    { algorithm: "HS384" },
    { expiresIn: "90d" }
  );
};

export { createToken, verifyToken, createAccessToken, createRefreshToken };
