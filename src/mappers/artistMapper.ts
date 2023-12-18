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

import { Document, Types } from "mongoose"
import { ArtistDb } from "../access/database/models/interfaces/artistDb"
import { injectable } from "tsyringe"
import { ImageMapper } from "./imageMapper"
import { Artist } from "../models/artist"
import { Image } from "../models/image"

@injectable()
export class ArtistMapper {

    public toArtist(data: Artist & Document<any, any, Artist>): Artist {
        let cleanedData: Artist = {
            id: data._id,
            name: data.name,
            cover: data.cover, // DEPRECATED
            coverV2: data.coverV2 ? this.imageMapper.toImage(<Image & Document<any, any, Image>>data.coverV2) : undefined,
            mbid: data.mbid,
            lastUpdated: data.lastUpdated,
            createdAt: data.createdAt
        }
        return cleanedData
    }

    public toArtistDTO(data: Artist): ArtistDTO {
        let cleanedData: ArtistDTO = {
            id: data.id,
            name: data.name,
            cover: data.cover, // DEPRECATED
            coverV2: data.coverV2 ? this.imageMapper.toImageDTO(data.coverV2) : undefined
        }
        return cleanedData
    }

    public toArtistDb(data: Artist): ArtistDb {
        let cleanedData: ArtistDb = {
            cover: data.cover, // DEPRECATED
            coverV2: data.coverV2 ? new Types.ObjectId(data.coverV2.id) : undefined,
            mbid: data.mbid,
            name: data.name,
            lastUpdated: data.lastUpdated,
            createdAt: data.createdAt
        }
        return cleanedData
    }

    constructor(private imageMapper: ImageMapper) { }
}