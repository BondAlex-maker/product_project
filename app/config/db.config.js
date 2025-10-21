export default {
    HOST: "127.0.0.1",
    USER: "kigabit",
    PASSWORD: "root123321",
    DB: "mvp_database",
    dialect: "postgres",
    PORT: 5432,
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000,
    },
};