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
import { DB_VERSION } from "../config/appConfig"
import { DbInfo, IDbInfo } from "../models/dbInfoModel";
import logger from "../utils/logger";
import { migration0 } from "./migrationScripts/migration0";
import { migration1 } from "./migrationScripts/migration1";
import { migration2 } from "./migrationScripts/migration2";
import { migration3 } from "./migrationScripts/migration3";
import { migration4 } from "./migrationScripts/migration4";

export interface IMigration {
    up: () => Promise<void>
    down: () => Promise<void>
}

const migrations: IMigration[] = [
    migration0,
    migration1,
    migration2,
    migration3,
    migration4
]

async function FetchDbInfo(): Promise<Document<any, any, IDbInfo> & IDbInfo> {
    return await DbInfo.find()
        .then(async (infos) => {
            if (infos.length == 0) {
                return await DbInfo.create({ version: DB_VERSION })
            }
            else return infos[0]
        })
}

export async function Migrate() {

    //Fetch db version
    var info = await FetchDbInfo()

    var db_ver = info.version
    var app_ver = DB_VERSION

    logger.info(`Database schema version : ${db_ver}`)
    logger.info(`Application schema version : ${app_ver}`)

    //Compare db version with app version and apply migration
    if (db_ver > app_ver) {
        for (var i = db_ver; i > app_ver; i--) {
            await migrations[i].down()
            info.version--
            await info.save()
        }
    }
    if (db_ver < app_ver) {
        for (var i = db_ver; i < app_ver; i++) {
            await migrations[i].up()
            info.version++
            await info.save()
        }
    }
}