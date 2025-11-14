import "dotenv/config";                    // ⭐ load .env automatically
import session from "express-session";      // ⭐ express-session
import express from "express";
import cors from "cors";

import Lab5 from "./Lab5/index.js";
import db from "./Lab5/Kambaz/Database/index.js";
import UserRoutes from "./Lab5/Kambaz/Users/routes.js";
import AssignmentsRoutes from "./Lab5/Kambaz/Assignments/routes.js";


import CourseRoutes from "./Lab5/Kambaz/Courses/routes.js";
import EnrollmentsRoutes from "./Lab5/Enrollments/routes.js";


const app = express();

app.use(
  cors({
    credentials: true,
    origin: process.env.CLIENT_URL || "http://localhost:3000",
  })
);

const sessionOptions = {
  secret: process.env.SESSION_SECRET || "kambaz",
  resave: false,
  saveUninitialized: false,
};

if (process.env.SERVER_ENV !== "development") {
  sessionOptions.proxy = true;
  sessionOptions.cookie = {
    sameSite: "none",
    secure: true,
    domain: process.env.SERVER_URL,
  };
}

app.use(session(sessionOptions));

app.use(express.json());

UserRoutes(app, db);

CourseRoutes(app, db);

AssignmentsRoutes(app, db);
EnrollmentsRoutes(app, db);


Lab5(app);



app.listen(process.env.PORT || 4000);
