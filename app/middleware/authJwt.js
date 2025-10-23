import jwt from "jsonwebtoken";
import config from "../config/auth.config.js";
import db from "../models/index.js";

const User = db.user;
const { TokenExpiredError } = jwt;


// const catchError = (err, res) => {
//     if (err instanceof TokenExpiredError) {
//         return res.status(401).send({ message: "Unauthorized! Access Token was expired!" });
//     }
//
//     return res.sendStatus(401).send({ message: "Unauthorized!" });
// }
// helpers to make jwt.verify work with await
const verifyTokenAsync = (token, secret) =>
    new Promise((resolve, reject) => {
        jwt.verify(token, secret, (err, decoded) => {
            if (err) reject(err);
            else resolve(decoded);
        });
    });

const verifyToken = async (req, res, next) => {
    try {
        let token = req.headers["x-access-token"];

        if (!token) {
            return res.status(403).send({
                message: "No token provided!"
            });
        }

        const decoded = await verifyTokenAsync(token, config.secret);
        req.userId = decoded.id;
        next();
    } catch (err) {
        return res.status(401).send({
            message: "Unauthorized!"
        });
    }
};

const isAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "admin") {
                return next();
            }
        }

        return res.status(403).send({
            message: "Require Admin Role!"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "Internal server error."
        });
    }
};

const isModerator = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator") {
                return next();
            }
        }

        return res.status(403).send({
            message: "Require Moderator Role!"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "Internal server error."
        });
    }
};

const isModeratorOrAdmin = async (req, res, next) => {
    try {
        const user = await User.findByPk(req.userId);
        const roles = await user.getRoles();

        for (let i = 0; i < roles.length; i++) {
            if (roles[i].name === "moderator" || roles[i].name === "admin") {
                return next();
            }
        }

        return res.status(403).send({
            message: "Require Moderator or Admin Role!"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).send({
            message: "Internal server error."
        });
    }
};

export const authJwt = {
    verifyToken,
    isAdmin,
    isModerator,
    isModeratorOrAdmin
};