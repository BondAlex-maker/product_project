export default (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
        },
        email: {
            type: Sequelize.STRING,
        },
        password: {
            type: Sequelize.STRING,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.refreshToken, {
            foreignKey: "userId",
        });
    };

    return User;
};
