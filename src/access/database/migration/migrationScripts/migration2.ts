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
import { albumModel } from "../../models/albumModel"
import { imageModel } from "../../models/imageModel"
import logger from "../../../../utils/logger"
import { getAlbumMBId } from "../../../api/musicbrainzApi"
import { deleteImage } from "../../../file/imageFile"

export const migration2: IMigration = {
    //Remove single MB ID and fetch all fiting MB IDs 
    async up() {
        var albums = await albumModel.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            logger.info(`Migration 2 -> 3 album ${a.id}`)

            a.mbids = await getAlbumMBId(a)
            a.mbid = undefined

            await a.save()
        }
    },

    //Remove album covers
    async down() {
        var albums = await albumModel.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            if (a.cover) {
                logger.info(`Migration 2 -> 1 album ${a.id}`)

                var cover = await imageModel.findById(a.cover)

                deleteImage(cover.path)
                cover.delete()

                a.cover = undefined
                await a.save()
            }
        }
    }
}