module.exports = {
    MONGO_IP: process.env.MONGO_IP || "mongo",
    MONGO_PORT: process.env.MONGO_PORT || 27017,
    MONGO_USER: process.env.MONGO_USER,
    MONGO_PASSWORD: process.env.MONGO_PASSWORD,
    SESSION_SECRET: process.env.SESSION_SECRET,
    APP_PORT: process.env.PORT || 3000,
    MUSIC_PATH: process.env.MUSIC_PATH || "./music"
}