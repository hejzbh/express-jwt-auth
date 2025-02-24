import express from "express";
import helmet from "helmet";
import cors from "cors";
import cookiesParser from "cookie-parser";
import authRouter from "@/routes/auth.js";
import postsRouter from "@/routes/posts.js";
import * as middlewares from "@/middlewares/index.js";

// Config
const PORT = process.env.PORT || 8080;

// App
const app = express();

// Helmet
app.use(helmet());
// JSON
app.use(express.json());
// Cookie parses
app.use(cookiesParser());

// Cors
app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

// Rate Limiter
app.use(middlewares.rateLimiter);

// If user is on blacklist
app.use(middlewares.checkBlacklist);

// Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/posts", middlewares.verifyAuth, postsRouter);

// Not Found
app.use(middlewares.notFoundRouteHandler);

// Error Handling
app.use(middlewares.errorHandler);

// Listening to server
app.listen(PORT, () => {
  console.log("Server running on port: " + PORT);
});
