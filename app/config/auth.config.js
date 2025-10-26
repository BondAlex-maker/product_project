export default {
    secret: process.env.JWT_SECRET,
    jwtExpiration: 3600,
    jwtRefreshExpiration: 86400
};