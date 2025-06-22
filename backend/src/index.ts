import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";

// Import routes
import authRoutes from "./routes/authRoutes";
import adminRoutes from "./routes/adminRoutes";
import generalInfoRoutes from "./routes/generalInfoRoutes";
import pdfRoutes from "./routes/pdfRoutes";

// Import error handling middleware
import { errorHandler, notFound } from "./middleware/errorMiddleware";

// Load environment variables
dotenv.config();

// Initialize express app
const app: Express = express();

// Middleware
app.use(
  cors({
    origin: [
      "https://codesculptor.net",
      "https://www.codesculptor.net",
      process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" })); // Added size limit for security
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Trust proxy for Vercel deployment
app.set("trust proxy", 1);

// Connect to MongoDB with better error handling
const connectDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI;

    if (!mongoUri) {
      throw new Error("MONGODB_URI is not defined in environment variables");
    }

    const conn = await mongoose.connect(mongoUri, {
      // Modern connection options
      maxPoolSize: 10, // Maintain up to 10 socket connections
      serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
      socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    });

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error: unknown) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Connect to database
connectDB();

// Handle MongoDB connection events
mongoose.connection.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});

mongoose.connection.on("disconnected", () => {
  console.log("MongoDB disconnected");
});

// Graceful shutdown
process.on("SIGINT", async () => {
  try {
    await mongoose.connection.close();
    console.log("MongoDB connection closed through app termination");
    process.exit(0);
  } catch (error) {
    console.error("Error during graceful shutdown:", error);
    process.exit(1);
  }
});

// Health check route
app.get("/api/health", (req: Request, res: Response) => {
  res.status(200).json({
    status: "ok",
    message: "Server is running",
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? "connected" : "disconnected",
  });
});

// API Routes
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/general-info", generalInfoRoutes);
app.use("/api/pdf", pdfRoutes);

// Root route for basic API info
app.get("/", (req: Request, res: Response) => {
  res.json({
    message: "VSME Reporting Tool API",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      auth: "/api/auth",
      admin: "/api/admin",
      generalInfo: "api/general-info",
      pdf: "/api/pdf",
    },
  });
});

// 404 handler - must be after all routes
app.use(notFound);

// Global error handler - must be last middleware
app.use(errorHandler);

// Start server
const PORT = process.env.PORT || 3001;

if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
    console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
  });
}

// For Vercel serverless deployment
export default app;
