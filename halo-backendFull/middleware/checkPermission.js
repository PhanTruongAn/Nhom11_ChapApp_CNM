import { NextFunction, Request, Response } from "express";
import HandleError from "../utils/HandleError";

export const checkPermission = ([...roles]) => {
    return (req, res, next) => {
        if (!roles.includes(req.user?.role)) {
            return next(new HandleError("You don't have permission", 403));
        }
        next();
    };
};
