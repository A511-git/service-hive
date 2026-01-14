import cors from "cors"
import cookieParser from "cookie-parser";
import express from "express";
import { ErrorHandler } from "./utils/error-handler.js"
import { api } from "./api/index.js"
import { FRONTEND_URL } from "./config/index.js"

export const expressApp = (app) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));

    const allowedOrigins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://servicehive_frontend:80",
        FRONTEND_URL
    ];
    app.use(
        cors({
            origin: (origin, cb) => {
                if (!origin) return cb(null, true);
                if (allowedOrigins.includes(origin))  return cb(null, true);
                return cb(new Error(`CORS blocked: ${origin}`), false);
            },
            credentials: true,
            exposedHeaders: ["Authorization"],
        })
    );
    app.use(express.static("public"));
    app.use(cookieParser());

    app.use("/api", api())

    app.use(ErrorHandler);
}


