// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2022  DPlouc

// This program is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version 3 of the License, or
// (at your option) any later version.

// This program is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with this program.  If not, see <https://www.gnu.org/licenses/>.

module.exports = {
    MONGO_IP: process.env.QUAVER_DB_IP || "mongo",
    MONGO_PORT: Number(process.env.QUAVER_DB_PORT) || 27017,
    MONGO_USER: process.env.QUAVER_DB_USER,
    MONGO_PASSWORD: process.env.QUAVER_DB_PASSWORD,
    APP_PORT: Number(process.env.QUAVER_PORT) || 8080,
    MUSIC_PATH: process.env.QUAVER_MUSIC_PATH || "/music",
    FPCALC_PATH: process.env.QUAVER_FPCALC_PATH,
    HEADLESS: Boolean(process.env.QUAVER_HEADLESS) || false,
    DATA_PATH: process.env.QUAVER_DATA_PATH || "/data",
    DEBUG_LVL: Number(process.env.QUAVER_DEBUG_LEVEL) || 0
}