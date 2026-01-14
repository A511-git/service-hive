import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";
import { ErrorHandler } from "./utils/error-handler.js";
import { api } from "./api/index.js";
import { FRONTEND_URL } from "./config/index.js";

export const expressApp = (app) => {
    app.use(express.json({ limit: "1mb" }));
    app.use(express.urlencoded({ extended: true, limit: "1mb" }));

    const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://servicehive_frontend:80",
        FRONTEND_URL
    ];
    app.use(
        cors({
            origin: (origin, callback) => {
                if (!origin) return callback(null, true);
                if (allowedOrigins.includes(origin))
                    return callback(null, true);
                return callback(new Error("Not allowed by CORS"));
            },
            credentials: true,
            methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
            allowedHeaders: ["Content-Type", "Authorization"],
            exposedHeaders: ["Authorization"],
        })
    );
    app.options(/.*/, cors());

    app.use(express.static("public"));
    app.use(cookieParser());

    app.use("/api", api());

    app.use(ErrorHandler);
};
