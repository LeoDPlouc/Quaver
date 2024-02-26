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

import "reflect-metadata"
import mongoose from "mongoose";
import { APP_PORT, DEBUG_LVL, } from "./config/config";
import { runTaskManager } from "./taskManager/taskManager";
import app from "./app";
import { AppException } from "./utils/exceptions/appException";
import { FileService } from "./service/fileService";
import { Logger } from "./utils/logger";
import { container } from "tsyringe";
import { connectToDb } from "./DAO/utils";

//Declare the objects stored in session - DEPRECATED
declare module "express-session" {
  interface SessionData {
    user: User & mongoose.Document<any, any, User>;
  }
}

const logger = container.resolve(Logger)

logger.debug(1, `Debug level: ${DEBUG_LVL}`, "App")

//Connect to the db
connectToDb("App").then(async () => {
  await container.resolve(FileService).checkDataDirectores()

  //Start collection of the songs
  runTaskManager();

  //Open server
  app.listen(APP_PORT, () => logger.info(`listening on port ${APP_PORT}`, "App"));
});
