import db from "../models/index.js";
import config from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.user;
const Role = db.role;
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
            // default role = 1
            await user.setRoles([1]);
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
                expiresIn: 86400 // 24 hours
            }
        );

        // Get roles
        const roles = await user.getRoles();
        const authorities = roles.map(role => "ROLE_" + role.name.toUpperCase());

        res.status(200).send({
            id: user.id,
            username: user.username,
            email: user.email,
            roles: authorities,
            accessToken: token
        });
    } catch (err) {
        res.status(500).send({ message: err.message });
    }
};
