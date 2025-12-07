import "dotenv/config";                    // ⭐ load .env automatically
import session from "express-session";      // ⭐ express-session
import express from "express";
import mongoose from "mongoose";            // Load the mongoose library
import cors from "cors";

import Lab5 from "./Lab5/index.js";
import db from "./Lab5/Kambaz/Database/index.js";
import UserRoutes from "./Lab5/Kambaz/Users/routes.js";
import AssignmentsRoutes from "./Lab5/Kambaz/Assignments/routes.js";


import CourseRoutes from "./Lab5/Kambaz/Courses/routes.js";
import EnrollmentsRoutes from "./Lab5/Enrollments/routes.js";

const CONNECTION_STRING = process.env.DATABASE_CONNECTION_STRING || "mongodb://127.0.0.1:27017/kambaz";
mongoose.connect(CONNECTION_STRING);        // connect to the kambaz database

const app = express();

// Configure allowed origins for CORS
const allowedOrigins = [
  "http://localhost:3000",
  process.env.CLIENT_URL,
  // Support Vercel preview deployments
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(",") : []),
].filter(Boolean); // Remove any undefined values

app.use(
  cors({
    credentials: true,
    origin: (origin, callback) => {
      // Allow requests with no origin (like mobile apps or curl requests)
      if (!origin) return callback(null, true);
      
      // Check if origin is in allowed list
      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }
      
      // Allow Vercel preview deployments (they have a pattern)
      if (origin.includes("vercel.app")) {
        return callback(null, true);
      }
      
      // Default: deny
      callback(new Error("Not allowed by CORS"));
    },
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
