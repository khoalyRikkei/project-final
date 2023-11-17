import bodyParser from "body-parser";
import express from "express";
import { connection } from "./configs/db.config.js";

import bcrypt from "bcrypt";
import { sessionConfig } from "./configs/session.config.js";

const app = express();

// Config
app.use(bodyParser.urlencoded({ extended: false }));

// Config session
app.use(sessionConfig);

// API

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
        console.log(data);
        res.status(204).json({ message: "Success" });
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

    console.log(111, isMatch);
    if (!isMatch) {
      return res.status(401).json({
        message: "Unauthorized",
        errors: {
          messageLogin: "Email or password is incorrect",
        },
      });
    }

    req.session.userId = data[0].id;
    req.session.role = data[0].role;

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
app.listen(1111, () => {
  console.log("Connecting to http://localhost:1111");
});
