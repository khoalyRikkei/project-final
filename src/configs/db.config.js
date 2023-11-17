// get the client
import mysql from "mysql2/promise";

// create the connection to database
export const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  database: "project-final",
  password: "1111",
});
