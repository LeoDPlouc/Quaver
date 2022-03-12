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
import { Album } from "../../models/albumModel"
import logger from "../../../../utils/logger"

export const migration0: IMigration = {
    //Add MB ID to albums
    async up() {
        var albums = await Album.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            if (!a.mbid) {
                logger.info(`Migration 0 -> 1 album ${a.id}`)

                a.mbid = await getAlbumMBIdLegacy(a)
                await a.save()
            }
        }
    },
    async down() {

    }
}