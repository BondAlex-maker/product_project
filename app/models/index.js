import dbConfig from "../config/db.config.js";
import { Sequelize, DataTypes } from "sequelize";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";
import Role from "./role.model.js";
import Product from "./product.model.js";

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: dbConfig.pool,
        port: Number(dbConfig.PORT),
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.products = Product(sequelize, DataTypes);
db.user = User(sequelize, DataTypes);
db.refreshToken = RefreshToken(sequelize, DataTypes);
db.role = Role(sequelize, DataTypes);

db.role.belongsToMany(db.user, {
    through: "user_roles"
});
db.user.belongsToMany(db.role, {
    through: "user_roles"
});

db.ROLES = ["user", "admin", "moderator"];

Object.keys(db).forEach((modelName) => {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});
export default db;