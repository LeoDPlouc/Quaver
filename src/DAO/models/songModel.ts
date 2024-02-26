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

import { Schema, model, Types, FilterQuery, ProjectionType } from "mongoose"
import { SongDb } from "./interfaces/songDb"
import { injectable } from "tsyringe"

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
    albumV2: {
        type: Schema.Types.ObjectId,
        ref: "Album"
    },
    artists: {
        type: [Schema.Types.ObjectId],
        ref: "Artist"
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
    },
    joinings: [{
        mbid: String,
        joinphrase: String
    }]
})

const songModel = model<SongDb>("Song", songSchema)

@injectable()
export class SongModel {

    public get model() { return songModel }

    public find(query?: FilterQuery<SongDb>, projection?: ProjectionType<SongDb>) {
        return songModel.find(query || {}, projection || {})
    }

    public findById(id: string) {
        return songModel.findById(id)
    }

    public create(album: SongDb) {
        return songModel.create(album)
    }

    public findByIdAndUpdate(id: string, song: SongDb) {
        return songModel.findByIdAndUpdate(id, song)
    }

    public deleteMany(query?: FilterQuery<SongDb>) {
        return songModel.deleteMany(query || {})
    }
}