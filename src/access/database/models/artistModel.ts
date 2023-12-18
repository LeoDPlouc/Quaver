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

import { FilterQuery, Schema, model } from "mongoose"
import { injectable } from "tsyringe"
import { ArtistDb } from "./interfaces/artistDb"

const artistSchema = new Schema<ArtistDb>({
    name: {
        type: String
    },
    cover: { // DEPRECATED
        type: String
    },
    coverV2: {
        type: Schema.Types.ObjectId,
        ref: "Image"
    },
    mbid: {
        type: String
    },
    createdAt: {
        type: Number
    },
    lastUpdated: {
        type: Number
    }
})

const artistModel = model<ArtistDb>("Artist", artistSchema)

@injectable()
export class ArtistModel {
    public get model() { return artistModel }

    public find(query?: FilterQuery<ArtistDb>) {
        return artistModel.find(query || {})
    }

    public findById(id: string) {
        return artistModel.findById(id)
    }

    public create(artist: ArtistDb) {
        return artistModel.create(artist)
    }

    public findByIdAndUpdate(id: string, artist: ArtistDb) {
        return artistModel.findByIdAndUpdate(id, artist)
    }

    public deleteMany(query?: FilterQuery<ArtistDb>) {
        return artistModel.deleteMany(query || {})
    }
}