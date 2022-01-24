module.exports = {
    MONGO_IP: process.env.QUAVER_DB_IP || "mongo",
    MONGO_PORT: process.env.QUAVER_DB_PORT || 27017,
    MONGO_USER: process.env.QUAVER_DB_USER,
    MONGO_PASSWORD: process.env.QUAVER_DB_PASSWORD,
    SESSION_SECRET: process.env.QUAVER_SESSION_SECRET,
    APP_PORT: process.env.QUAVER_PORT || 8080,
    MUSIC_PATH: process.env.QUAVER_MUSIC_PATH || "./music",
    FPCALC_PATH: process.env.QUAVER_FPCALC_PATH,
    HEADLESS: process.env.QUAVER_HEADLESS
}