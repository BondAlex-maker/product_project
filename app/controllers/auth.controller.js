import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.user;
const Role = db.role;
const RefreshToken = db.refreshToken;
const Op = db.Sequelize.Op;

export const signup = async (req, res) => {
    try {
        // Hash password
        const hashedPassword = bcrypt.hashSync(req.body.password, 8);

        // Create user
        const user = await User.create({
            username: req.body.username,
            email: req.body.email,
            password: hashedPassword
        });

        // Assign roles
        if (req.body.roles) {
            const roles = await Role.findAll({
                where: {
                    name: {
                        [Op.or]: req.body.roles
                    }
                }
            });
            await user.setRoles(roles);
        } else {
            // default role = 3 admin
            await user.setRoles([3]);
        }

        res.send({ message: "User was registered successfully!" });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const signin = async (req, res) => {
    try {
        const user = await User.findOne({
            where: { username: req.body.username }
        });

        if (!user) {
            return res.status(404).send({ message: "User Not found." });
        }

        // Check password
        const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

        if (!passwordIsValid) {
            return res.status(401).send({
                accessToken: null,
                message: "Invalid Password!"
            });
        }

        // Generate JWT token
        const token = jwt.sign(
            { id: user.id },
            config.secret,
            {
                algorithm: "HS256",
                allowInsecureKeySizes: true,
                // expiresIn: 86400 // 24 hours
                expiresIn: config.jwtExpiration // 1 hours
            }
        );

        let refreshToken = await RefreshToken.createToken(user);

        // Get roles
        const roles = await user.getRoles();
        const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token,
            refreshToken: refreshToken,
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};

export const refreshToken = async (req, res) => {
    const { refreshToken: requestToken } = req.body;

    if (!requestToken) {
        return res.status(403).json({ message: "Refresh Token is required!" });
    }

    try {
        const refreshToken = await RefreshToken.findOne({ where: { token: requestToken } });

        if (!refreshToken) {
            return res.status(403).json({ message: "Refresh token is not in database!" });
        }

        if (RefreshToken.verifyExpiration(refreshToken)) {
            await RefreshToken.destroy({ where: { id: refreshToken.id } });

            return res.status(403).json({
                message: "Refresh token was expired. Please make a new signin request",
            });
        }

        const user = await refreshToken.getUser();

        // Генерируем новый access token
        const newAccessToken = jwt.sign({ id: user.id }, config.secret, {
            expiresIn: config.jwtExpiration,
        });

        return res.status(200).json({
            accessToken: newAccessToken,
            refreshToken: refreshToken.token,
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: err.message || err });
    }
};
