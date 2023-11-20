import session from "express-session";
import MySQLStore2 from "express-mysql-session";
const MySQLStore = MySQLStore2(session);

const options = {
  host: "localhost",
  user: "root",
  database: "project_final",
  password: "1111",
};

const sessionStore = new MySQLStore(options);

export const sessionConfig = session({
  key: "session_cookie_name",
  secret: "session_cookie_secret",
  store: sessionStore,
  resave: false,
  saveUninitialized: false,
  cookie: {
    maxAge: 3600 * 24 * 30 * 1000,
  },
});
