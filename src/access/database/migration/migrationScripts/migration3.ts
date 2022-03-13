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

import { albumModel } from "../../models/albumModel"
import logger from "../../../../utils/logger"
import { IMigration } from "../migration"
import { getAlbumCoverLegacy2 } from "../legacy/legacyCode"

export const migration3: IMigration = {
    //Download album covers
    async up() {
        var albums = await albumModel.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            try {
                if (!a.cover) {
                    logger.info(`Migration 3 -> 4 album ${a.id}`)

                    var cover = await getAlbumCoverLegacy2(a)
                    if (cover) {
                        await cover.save()

                        a.cover = cover.id
                        await a.save()
                    }
                }
            } catch (err) {
                logger.error(err)
            }
        }
    },

    //Remove MB ID list and keep only one
    async down() {
        var albums = await albumModel.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            if (a.mbids) {
                logger.info(`Migration 3 -> 2 album ${a.id}`)

                a.mbid = a.mbids[0]
                a.mbids = undefined

                await a.save()
            }
        }
    }
}