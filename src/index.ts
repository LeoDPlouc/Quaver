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

import mongoose from "mongoose"
import { APP_PORT } from "./config/config"
import { runSongCollector } from "./workers/workers"
import { IUser } from "./models/userModel"
import { waitForDb } from "./db/initdb"
import { Migrate } from "./db/migration"
import logger from "./utils/logger"
import app from "./app"

//Declare the objects stored in session
declare module 'express-session' {
    interface SessionData {
        user: IUser & mongoose.Document<any, any, IUser>
    }
}

//Connect to the db
waitForDb()
    .then(async () => {
        //Apply database migration
        await Migrate().catch((reason) => {
            logger.error(reason)
            process.exit(1)
        })

        //Start collection of the songs
        runSongCollector()

        //Open server
        app.listen(APP_PORT, () => logger.info(`listening on port ${APP_PORT}`))
    })