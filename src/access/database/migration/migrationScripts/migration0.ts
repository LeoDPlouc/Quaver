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
import { getAlbumMBIdLegacy } from "../legacy/legacyCode"
import { albumModel } from "../../models/albumModel"
import { logError, logInfo } from "../../../../utils/logger"
import { Failable } from "../../../../utils/Failable"

export const migration0: IMigration = {
    //Add MB ID to albums
    async up(): Promise<Failable<null>> {
        try {
            var albums = await albumModel.find()
        } catch (err) {
            return {
                failure: {
                    file: __filename,
                    func: migration0.up.name,
                    msg: err
                }
            }
        }

        for (let i = 0; i < albums.length; i++) {
            let a = albums[i]

            if (!a.mbid) {
                logInfo(`Migration 0 -> 1 album ${a.id}`)

                let result = await getAlbumMBIdLegacy(a)

                if (result.failure) {
                    return {
                        failure: {
                            file: __filename,
                            func: migration0.up.name,
                            msg: "AlbumMBId fetching error",
                            sourceFailure: result.failure
                        }
                    }
                }
                if (!result.result) { continue }

                a.mbid = result.result
                await a.save()
            }
        }
    },
    async down(): Promise<Failable<null>> {
        return { result: null }
    }
}