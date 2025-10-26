export default (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,             // оставляем, но см. уникальный индекс ниже
            set(value) {              // <-- принудительно в нижний регистр
            this.setDataValue("username", String(value).toLowerCase());
            },
        },
        email: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,
        },
        password: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    });

    User.associate = (models) => {
        User.hasMany(models.refreshToken, {
            foreignKey: "userId",
        });
    };

    return User;
};
