export default (sequelize, Sequelize) => {
    return sequelize.define("product", {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        image: {
            type: Sequelize.STRING,
            allowNull: true,
        },
        ingredients: {
            type: Sequelize.TEXT,
            allowNull: true,
        },
        type: {
            type: Sequelize.ENUM("common", "alcohol"),
            allowNull: false,
            defaultValue: "common",
        },
        price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        sale_price: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: true,
        },
    });
};
