"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.signupValidation = void 0;
const express_validator_1 = require("express-validator");
exports.signupValidation = [
    (0, express_validator_1.body)('name').isLength({ min: 2 }),
    (0, express_validator_1.body)('username').isLength({ min: 6 }),
    (0, express_validator_1.body)('password').isLength({ min: 6 }),
    (0, express_validator_1.body)('avatar').optional().isURL(),
];
