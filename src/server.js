import bodyParser from "body-parser";
import express from "express";
import { connection } from "./configs/db.config.js";
import cookieParser from "cookie-parser";
import bcrypt from "bcrypt";
import { sessionConfig } from "./configs/session.config.js";
import {
  createAccessToken,
  createRefreshToken,
  createToken,
} from "./utils/jwt.js";
import { isAdmin, isAuth } from "./middlewares/is-auth.js";

import {
  deleteCloudinary,
  uploadToCloudinary,
} from "./configs/clound.config.js";
import { upload } from "./configs/multer.cofig.js";
import { uploadFile } from "./middlewares/uploadFile.js";
import cors from "cors";
import { validationProduct } from "./middlewares/handleValidator.js";

const app = express();

// Config
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Config session
app.use(sessionConfig);

// API

app.get("/sendmail", (req, res) => {
  sendMail();
});

app.get("/", (req, res) => {
  console.log(111, req.session);
});

app.post("/api/v1/auth/register", async (req, res) => {
  const userRegister = { ...req.body };
  try {
    const [data, fields] = await connection.execute(
      `SELECT * FROM users WHERE email='${userRegister.email}'`
    );
    if (data.length == 0) {
      const hashPassword = bcrypt.hashSync(userRegister.password, 12);
      const [data, fields] = await connection.execute(
        `INSERT INTO users (email,password, role) VALUES (?, ?, ?)`,
        [userRegister.email, hashPassword, 0]
      );
      if (data) {
        return res.status(204).json({ message: "Success" });
      }
    }
    return res.status(400).json({
      message: "Bad request",
      errors: {
        messageRegister: "Email is existed! ",
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Server Error" });
  }
});

app.post("/api/v1/auth/login", async (req, res) => {
  const userLogin = { ...req.body };
  try {
    const [data, fields] = await connection.execute(
      `SELECT * FROM users WHERE email='${userLogin.email}'`
    );
    if (data.length == 0) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          messageLogin: "Email or password is incorrect",
        },
      });
    }

    const isMatch = bcrypt.compareSync(userLogin.password, data[0].password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          messageLogin: "Email or password is incorrect",
        },
      });
    }

    console.log(222, req.session);
    req.session.userId = userLogin.email;

    return res.status(200).json({
      message: "Success",
      data: {
        id: data[0].id,
        role: data[0].role,
      },
    });
  } catch (error) {}
});

app.get("/api/v1/auth/logout", async (req, res) => {
  console.log(111, req.session.id);
  const session_id = req.session.id;
  if (!session_id) {
    return res.status(400).json({ message: "Invalid session" });
  }
  try {
    const [data, fields] = await connection.execute(
      `DELETE  FROM sessions WHERE session_id='${session_id}'`
    );
    console.log(data);
    if (data.affectedRows) {
      res.clearCookie("session_cookie_name");
      return res.status(200).json({ message: "Session deleted successfully" });
    }

    return res.status(400).json({ message: "Invalid session" });
  } catch (error) {
    console.log(error);
  }
  res.status(200).json({ message: "Success" });
});

app.post("/api/v1/auth/login-jwt", async (req, res) => {
  console.log(1111111);
  const userLogin = { ...req.body };
  try {
    const [data, fields] = await connection.execute(
      `SELECT * FROM users WHERE email='${userLogin.email}'`
    );
    if (data.length == 0) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          messageLogin: "Email or password is incorrect",
        },
      });
    }

    const isMatch = bcrypt.compareSync(userLogin.password, data[0].password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          messageLogin: "Email or password is incorrect",
        },
      });
    }

    const token = createToken({ userId: data[0].id, role: data[0].role });
    res.header("Authorization", "Bearer " + token);
    return res.status(200).json({
      message: "Success",
      data: {
        id: data[0].id,
        role: data[0].role,
      },
    });
  } catch (error) {
    console.log(111, error);
  }
});

app.post("/api/v1/auth/login-access-token", async (req, res) => {
  const userLogin = { ...req.body };
  try {
    const [data, fields] = await connection.execute(
      `SELECT * FROM users WHERE email='${userLogin.email}'`
    );
    if (data.length == 0) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          messageLogin: "Email or password is incorrect",
        },
      });
    }

    const isMatch = bcrypt.compareSync(userLogin.password, data[0].password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          messageLogin: "Email or password is incorrect",
        },
      });
    }

    const accessToken = createAccessToken({
      userId: data[0].id,
      role: data[0].role,
    });
    const refreshToken = createRefreshToken({
      userId: data[0].id,
      role: data[0].role,
    });

    res.cookie("refreshToken", refreshToken, {
      maxAge: 60 * 60 * 24 * 90 * 1000,
      httpOnly: true,
    });

    res.header("Authorization", "Bearer " + accessToken);
    return res.status(200).json({
      message: "Success",
      data: {
        id: data[0].id,
        role: data[0].role,
      },
    });
  } catch (error) {
    console.log(111, error);
  }
});

app.get("/api/v1/users", isAuth, (req, res, next) => {});
app.delete("/api/v1/users/1", isAdmin, (req, res, next) => {});
app.get("/api/v1/refreshToken", (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) {
    // Người dùng phải login lại
    return;
  }

  try {
    //  Chúng ta phải lấy lại thông tin user
    const data = verifyToken(refreshToken);
    // Đưa vào token mới

    const accessToken = createAccessToken({
      userId: data.id,
      role: data.role,
    });

    // Gửi lại cho người dùng
    res.header("Authorization", "Bearer " + accessToken);
    return res.status(204);
  } catch (error) {
    // Người dùng phải login lại
  }
});

app.post(
  "/api/v1/admin/users/:id/upload-avatar",
  upload.single("image"),
  uploadFile,
  async (req, res, next) => {
    console.log(req.urlUpload);
    console.log("ID", req.params.id);
    if (req.urlUpload) {
      const [data, fields] = await connection.execute(`
      UPDATE users
      SET avatar="${req.urlUpload}"
      WHERE id=${req.params.id}
      
      `);

      console.log("Kiểm tra data", data);
      // Tien hành truy vấn và gửi file lên
    }
  }
);

app.post("/api/v1/admin/users/:id/delete-avatar", (req, res, next) => {
  deleteCloudinary("cld-sample")
    .then((result) => {
      console.log(111, result);
      res.json({ message: "success" });
    })
    .catch((err) => {
      console.log(111, err);
    });
});

app.post(
  "/api/v1/products",
  upload.single("image"),
  uploadFile,
  validationProduct,
  (req, res) => {
    const product = { ...req.body };
  }
);

app.use((err, req, res, next) => {
  console.log("error product", err);
});

app.listen(1111, () => {
  console.log("Connecting to http://localhost:1111");
});
