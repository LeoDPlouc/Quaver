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

import { IMigration } from "../migration"
import { getAlbumCoverLegacy } from "../legacy/legacyCode"
import { albumModel } from "../../models/albumModel"
import { Failable, Failure } from "../../../../utils/Failable"
import { logError, logInfo } from "../../../../utils/logger"

export const migration1: IMigration = {
    //Download album covers
    async up(): Promise<Failable<null>> {
        try {
            var albums = await albumModel.find()
        } catch (err) {
            let failure: Failure = {
                file: __filename,
                func: migration1.up.name,
                msg: err
            }
            logError(failure)
            return
        }

        for (let i = 0; i < albums.length; i++) {
            let a = albums[i]

            if (!a.cover) {
                logInfo(`Migration 1 -> 2 album ${a.id}`)

                let result = await getAlbumCoverLegacy(a)

                if (result.failure) {
                    return {
                        failure: {
                            file: __filename,
                            func: migration1.up.name,
                            msg: "Album fetching error",
                            sourceFailure: result.failure
                        }
                    }
                }
                if (!result.result) { continue }

                let cover = result.result
                if (cover) {
                    try {
                        await cover.save()
                    } catch (err) {
                        return {
                            failure: {
                                file: __filename,
                                func: migration1.up.name,
                                msg: err
                            }
                        }
                    }

                    a.cover = cover.id
                    try {
                        await a.save()
                    } catch (err) {
                        return {
                            failure: {
                                file: __filename,
                                func: migration1.up.name,
                                msg: err
                            }
                        }
                    }
                }
            }
        }
    },

    //Remove MB IDs
    async down(): Promise<Failable<null>> {
        try {
            var albums = await albumModel.find()
        } catch (err) {
            return {
                failure: {
                    file: __filename,
                    func: migration1.down.name,
                    msg: err
                }
            }
        }

        for (let i = 0; i < albums.length; i++) {
            let a = albums[i]

            if (!a.mbid) {
                logInfo(`Migration 1 -> 0 album ${a.id}`)

                a.mbid = undefined

                try {
                    await a.save()
                } catch (err) {
                    return {
                        failure: {
                            file: __filename,
                            func: migration1.down.name,
                            msg: err
                        }
                    }
                }
            }
        }
    }
}