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

import mongoose from "mongoose";
import { APP_PORT, DEBUG_LVL, } from "./config/config";
import { runTaskManager } from "./taskManager/taskManager";
import { Migrate } from "./access/database/migration/migration";
import { logger } from "./utils/logger";
import app from "./app";
import { connectToDb } from "./access/database/utils";
import { AppException } from "./utils/exceptions/appException";
import { songService } from "./service/songService";
import { fileService } from "./service/fileService";

//Declare the objects stored in session
declare module "express-session" {
  interface SessionData {
    user: User & mongoose.Document<any, any, User>;
  }
}

logger.debug(1, `Debug level: ${DEBUG_LVL}`, "App")

//Connect to the db
connectToDb("App").then(async () => {
  await fileService.checkDataDirectores()

  //Apply database migration
  await Migrate().catch((err) => {
    logger.error(new AppException(__filename, "main", err));
    process.exit(1);
  });

  //Start collection of the songs
  runTaskManager();

  //Open server
  app.listen(APP_PORT, () => logger.info(`listening on port ${APP_PORT}`, "App"));
});
