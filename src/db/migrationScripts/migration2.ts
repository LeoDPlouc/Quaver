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

import { Album } from "../../models/albumModel"
import { getAlbumCover, getAlbumMBId } from "../../processing/albumProcessor"
import { IMigration } from "../migration"
import { Image } from "../../models/imageModel"
import { deleteImage } from "../../processing/imageProcessor"

export const migration2: IMigration = {
    async up() {
    },
    async down() {
        var albums = await Album.find()

        for (var i = 0; i < albums.length; i++) {
            var a = albums[i]

            if (a.cover) {
                console.log(`Migration 2 -> 1 album ${a.id}`)

                var cover = await Image.findById(a.cover)

                deleteImage(cover)
                cover.delete()

                a.cover = undefined
                await a.save()
            }
        }
    }
}