export default {
    secret: process.env.JWT_SECRET,
    jwtExpiration: process.env.JWT_EXPIRATION || 3600,
    jwtRefreshExpiration: process.env.JWT_REFRESH_EXPIRATION || 86400
};