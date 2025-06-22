"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
// Import routes
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const adminRoutes_1 = __importDefault(require("./routes/adminRoutes"));
const generalInfoRoutes_1 = __importDefault(require("./routes/generalInfoRoutes"));
const pdfRoutes_1 = __importDefault(require("./routes/pdfRoutes"));
// Import error handling middleware
const errorMiddleware_1 = require("./middleware/errorMiddleware");
// Load environment variables
dotenv_1.default.config();
// Initialize express app
const app = (0, express_1.default)();
// Middleware
app.use((0, cors_1.default)({
    origin: [
        "https://codesculptor.net",
        "https://www.codesculptor.net",
        process.env.FRONTEND_URL || "http://localhost:3000",
    ],
    credentials: true,
}));
app.use(express_1.default.json({ limit: "10mb" })); // Added size limit for security
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Trust proxy for Vercel deployment
app.set("trust proxy", 1);
// Connect to MongoDB with better error handling
const connectDB = async () => {
    try {
        const mongoUri = process.env.MONGODB_URI;
        if (!mongoUri) {
            throw new Error("MONGODB_URI is not defined in environment variables");
        }
        const conn = await mongoose_1.default.connect(mongoUri, {
            // Modern connection options
            maxPoolSize: 10, // Maintain up to 10 socket connections
            serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
            socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
        });
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    }
    catch (error) {
        console.error("MongoDB connection error:", error);
        process.exit(1);
    }
};
// Connect to database
connectDB();
// Handle MongoDB connection events
mongoose_1.default.connection.on("error", (error) => {
    console.error("MongoDB connection error:", error);
});
mongoose_1.default.connection.on("disconnected", () => {
    console.log("MongoDB disconnected");
});
// Graceful shutdown
process.on("SIGINT", async () => {
    try {
        await mongoose_1.default.connection.close();
        console.log("MongoDB connection closed through app termination");
        process.exit(0);
    }
    catch (error) {
        console.error("Error during graceful shutdown:", error);
        process.exit(1);
    }
});
// Health check route
app.get("/api/health", (req, res) => {
    res.status(200).json({
        status: "ok",
        message: "Server is running",
        timestamp: new Date().toISOString(),
        database: mongoose_1.default.connection.readyState === 1 ? "connected" : "disconnected",
    });
});
// API Routes
app.use("/api/auth", authRoutes_1.default);
app.use("/api/admin", adminRoutes_1.default);
app.use("/api/general-info", generalInfoRoutes_1.default);
app.use("/api/pdf", pdfRoutes_1.default);
// Root route for basic API info
app.get("/", (req, res) => {
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
app.use(errorMiddleware_1.notFound);
// Global error handler - must be last middleware
app.use(errorMiddleware_1.errorHandler);
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
exports.default = app;
