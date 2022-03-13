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
import logger from "../../../../utils/logger"

export const migration1: IMigration = {
    //Download album covers
    async up() {
        var albums = await albumModel.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            if (!a.cover) {
                logger.info(`Migration 1 -> 2 album ${a.id}`)

                var cover = await getAlbumCoverLegacy(a)
                if (cover) {
                    await cover.save()

                    a.cover = cover.id
                    await a.save()
                }
            }
        }
    },

    //Remove MB IDs
    async down() {
        var albums = await albumModel.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            if (!a.mbid) {
                logger.info(`Migration 1 -> 0 album ${a.id}`)

                a.mbid = undefined
                await a.save()
            }
        }
    }
}