export default (sequelize, Sequelize) => {
    const User = sequelize.define("users", {
        username: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true,             
            set(value) {             
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
