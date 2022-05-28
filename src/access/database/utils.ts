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

import {
  MONGO_IP,
  MONGO_PASSWORD,
  MONGO_PORT,
  MONGO_USER,
} from "../../config/config";
import { createFailure, Failure } from "../../utils/Failure";
import { logError, logInfo } from "../../utils/logger";

const mongoUrl = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`;

export async function connectToDb(source: String) {
  await mongoose
    .connect(mongoUrl, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      dbName: "quaver",
    })
    .then(() => logInfo("Successfully connected to database", source))
    .catch((err) => {
      let failure: Failure = createFailure(err, __filename, connectToDb.name);
      logError(failure);
      //retry connection
      setTimeout(connectToDb, 5000);
    });
}
