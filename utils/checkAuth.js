"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.default = (req, res, next) => {
    const token = req.headers.authorization || '';
    if (process.env.JWT_SECRET === undefined) {
        throw Error("DATABASE_URI");
    }
    if (token) {
        try {
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            if (typeof decoded === 'string') {
                next(decoded);
            }
            req.userId = decoded._id;
            next();
        }
        catch (err) {
            console.log(err);
            return res.status(500).json({
                isSuccess: false,
                data: {},
                info: {
                    message: 'Access denied',
                    details: null
                }
            });
        }
    }
    else {
        return res.status(403).json({
            isSuccess: false,
            data: {},
            info: {
                message: 'Access denied',
                details: null
            }
        });
    }
};
