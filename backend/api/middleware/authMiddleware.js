"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticateToken = void 0;
const jwtUtils_1 = require("../utils/jwtUtils");
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1]; // Bearer TOKEN
    if (!token) {
        res.status(401).json({ message: "Access denied. No token provided." });
        return;
    }
    const decoded = (0, jwtUtils_1.verifyToken)(token);
    if (!decoded) {
        res.status(403).json({ message: "Invalid or expired token" });
        return;
    }
    req.user = decoded;
    next();
};
exports.authenticateToken = authenticateToken;
