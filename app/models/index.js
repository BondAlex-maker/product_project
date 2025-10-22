import dbConfig from "../config/db.config.js";
import Sequelize from "sequelize";
import Tutorial from "./product.model.js";
import User from "./user.model.js";
import RefreshToken from "./refreshToken.model.js";
import Role from "./role.model.js";

const sequelize = new Sequelize(
    dbConfig.DB,
    dbConfig.USER,
    dbConfig.PASSWORD, {
        host: dbConfig.HOST,
        dialect: dbConfig.dialect,
        pool: dbConfig.pool,
        port: dbConfig.PORT,
});

const db = {};
db.Sequelize = Sequelize;
db.sequelize = sequelize;
db.tutorials = Tutorial(sequelize, Sequelize);
db.user = User(sequelize, Sequelize);
db.refreshToken = RefreshToken(sequelize, Sequelize);
db.role = Role(sequelize, Sequelize);

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