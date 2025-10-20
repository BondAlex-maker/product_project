import config from "../config/auth.config.js";
import { v4 as uuidv4 } from "uuid";

export default (sequelize, Sequelize) => {
    const RefreshToken = sequelize.define("refreshToken", {
        token: {
            type: Sequelize.STRING,
        },
        expiryDate: {
            type: Sequelize.DATE,
        },
    });

    RefreshToken.createToken = async function (user) {
        const expiredAt = new Date();
        expiredAt.setSeconds(expiredAt.getSeconds() + config.jwtRefreshExpiration);

        const _token = uuidv4();

        const refreshToken = await this.create({
            token: _token,
            userId: user.id,
            expiryDate: expiredAt.getTime(),
        });

        return refreshToken.token;
    };

    RefreshToken.verifyExpiration = (token) => {
        return token.expiryDate.getTime() < new Date().getTime();
    };

    RefreshToken.associate = (models) => {
        RefreshToken.belongsTo(models.user, {
            foreignKey: "userId",
        });
    };

    return RefreshToken;
};
