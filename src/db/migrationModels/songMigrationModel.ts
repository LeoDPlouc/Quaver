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

import { Schema, model } from "mongoose"

interface ISong {
    title?: string,
    n?: number,
    duration?: Number,
    like?: Number,
    artist?: string,
    artistId?: string,
    album?: string,
    albumId?: string,
    path: string,
    acoustid?: string,
    year?: number,
    format?: string
}

const songSchema = new Schema<ISong>({
    title: {
        type: String
    },
    n: {
        type: Number
    },
    duration: {
        type: Number
    },
    like: {
        type: Number
    },
    artist: {
        type: String
    },
    artistId: {
        type: String
    },
    album: {
        type: String
    },
    albumId: {
        type: String
    },
    path: {
        type: String,
        require: [true, "Song must have a path"]
    },
    acoustid: {
        type: String
    },
    year: {
        type: Number
    },
    format: {
        type: String
    }
})
const Song = model<ISong>("Song", songSchema)

export { Song, ISong }