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

import { Document } from "mongoose";
import { DB_VERSION } from "../../../config/appConfig";
import { createFailure } from "../../../utils/Failure";
import { logger } from "../../../utils/logger";
import { dbInfoModel } from "../models/dbInfoModel";
import { migration0 } from "./migrationScripts/migration0";
import { migration1 } from "./migrationScripts/migration1";
import { migration2 } from "./migrationScripts/migration2";
import { migration3 } from "./migrationScripts/migration3";
import { migration4 } from "./migrationScripts/migration4";

export interface IMigration {
  up: () => Promise<void>;
  down: () => Promise<void>;
}

const migrations: IMigration[] = [
  migration0,
  migration1,
  migration2,
  migration3,
  migration4,
];

async function FetchDbInfo(): Promise<Document<any, any, DbInfo> & DbInfo> {
  try {
    return await dbInfoModel.find().then(async (infos) => {
      if (infos.length == 0) {
        return await dbInfoModel.create({ version: DB_VERSION });
      } else return infos[0];
    });
  } catch (err) {
    throw createFailure(err, __filename, FetchDbInfo.name);
  }
}

export async function Migrate(): Promise<void> {
  try {
    //Fetch db version
    let info = await FetchDbInfo();

    let db_ver = info.version;
    let app_ver = DB_VERSION;

    logger.info(`Database schema version : ${db_ver}`, "Migration");
    logger.info(`Application schema version : ${app_ver}`, "Migration");

    //Compare db version with app version and apply migration
    if (db_ver > app_ver) {
      for (let i = db_ver; i > app_ver; i--) {
        await migrations[i].down();
        info.version--;
      }
    }
    if (db_ver < app_ver) {
      for (var i = db_ver; i < app_ver; i++) {
        await migrations[i].up();
        info.version++;
      }
    }

    try {
      await info.save();
    } catch (err) {
      throw createFailure(err, __filename, Migrate.name);
    }
  } catch (err) {
    throw createFailure("Migration error", __filename, Migrate.name, err);
  }
}
