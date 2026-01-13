import cors from "cors"
import cookieParser from "cookie-parser";
import express from "express";
import { ErrorHandler } from "./utils/error-handler.js"
import { api } from "./api/index.js"


export const expressApp = (app) => {

    app.use(express.json({ limit: '1mb' }));
    app.use(express.urlencoded({ extended: true, limit: '1mb' }));
    app.use(
        cors({
            origin: true,        
            credentials: true,   
            exposedHeaders: ["Authorization"],
        })
    );
    app.use(express.static("public"));
    app.use(cookieParser());

    app.use("/api", api())

    app.use(ErrorHandler);
}


