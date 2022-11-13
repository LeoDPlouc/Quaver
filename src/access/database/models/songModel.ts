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
import { SongDb } from "./interfaces/songDb"

const songSchema = new Schema<SongDb>({
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
        type: Number,
        default: 0
    },
    artist: {
        type: String
    },
    artistId: {
        type: String
    },
    album: { // DEPRECATED
        type: String
    },
    albumId: { // DEPRECATED
        type: String
    },
    albumObjectId: {
        type: Schema.Types.ObjectId
    },
    artistsObjectId: {
        type: [Schema.Types.ObjectId]
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
    },
    lastUpdated: {
        type: Number,
    },
    mbid: {
        type: String
    }
})
export const songModel = model<SongDb>("Song", songSchema)