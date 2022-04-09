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
import { DB_VERSION } from "../../../config/appConfig"
import { Failable, Failure } from "../../../utils/Failable";
import { logError, logInfo } from "../../../utils/logger";
import { dbInfoModel } from "../models/dbInfoModel";
import { migration0 } from "./migrationScripts/migration0";
import { migration1 } from "./migrationScripts/migration1";
import { migration2 } from "./migrationScripts/migration2";
import { migration3 } from "./migrationScripts/migration3";
import { migration4 } from "./migrationScripts/migration4";

export interface IMigration {
    up: () => Promise<Failable<null>>
    down: () => Promise<Failable<null>>
}

const migrations: IMigration[] = [
    migration0,
    migration1,
    migration2,
    migration3,
    migration4
]

async function FetchDbInfo(): Promise<Failable<Document<any, any, DbInfo> & DbInfo>> {
    try {
        return {
            result: await dbInfoModel.find()
                .then(async (infos) => {
                    if (infos.length == 0) {
                        return await dbInfoModel.create({ version: DB_VERSION })
                    }
                    else return infos[0]
                })
        }
    } catch (err) {
        return {
            failure: {
                file: __filename,
                func: FetchDbInfo.name,
                msg: err
            }
        }
    }
}

export async function Migrate(): Promise<Failable<null>> {

    //Fetch db version
    let infoResult = await FetchDbInfo()
    if (infoResult.failure) {
        return {
            failure: {
                file: __filename,
                func: Migrate.name,
                msg: "Database Infos fetching error"
            }
        }
    }
    let info = infoResult.result

    let db_ver = info.version
    let app_ver = DB_VERSION

    logInfo(`Database schema version : ${db_ver}`)
    logInfo(`Application schema version : ${app_ver}`)

    //Compare db version with app version and apply migration
    if (db_ver > app_ver) {
        for (let i = db_ver; i > app_ver; i--) {
            let migrationResult = await migrations[i].down()
            if (migrationResult.failure) {
                return {
                    failure: {
                        file: __filename,
                        func: Migrate.name,
                        msg: "Migration error",
                        sourceFailure: migrationResult.failure
                    }
                }
            }
            info.version--

            try {
                await info.save()
            } catch (err) {
                let failure: Failure = {
                    file: __filename,
                    func: Migrate.name,
                    msg: err
                }
                logError(failure)
                return
            }
        }
    }
    if (db_ver < app_ver) {
        for (var i = db_ver; i < app_ver; i++) {
            let migrationResult = await migrations[i].up()
            if (migrationResult.failure) {
                return {
                    failure: {
                        file: __filename,
                        func: Migrate.name,
                        msg: "Migration error",
                        sourceFailure: migrationResult.failure
                    }
                }
            }
            info.version++

            try {
                await info.save()
            } catch (err) {
                let failure: Failure = {
                    file: __filename,
                    func: Migrate.name,
                    msg: err
                }
                logError(failure)
                return
            }
        }
    }
}