import express from "express";
import dbConnection from "./database/dbConnection.js";
import jobRouter from "./routes/jobRoutes.js";
import userRouter from "./routes/userRoutes.js";
import applicationRouter from "./routes/applicationRoutes.js";
import { config } from "dotenv";
import cors from "cors";
import { errorMiddleware } from "./middlewares/error.js";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload";

// Load environment variables
config({ path: "./config/config.env" });

// Initialize Express app
const app = express();

// Middleware: CORS
app.use(
  cors({
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST", "DELETE", "PUT"],
    credentials: true,
  })
);

// Middleware: Cookie Parser
app.use(cookieParser());

// Middleware: Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware: File Upload
app.use(
  fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
  })
);

// Database Connection
dbConnection();

// Routes
app.use("/api/v1/user", userRouter);
app.use("/api/v1/job", jobRouter);
app.use("/api/v1/application", applicationRouter);

// Middleware: Error Handling
app.use(errorMiddleware);

export default app;
