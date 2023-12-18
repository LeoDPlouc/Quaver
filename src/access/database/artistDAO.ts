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

import { Document } from "mongoose";
import { injectable } from "tsyringe";
import { UPDATE_METADATA_PERIOD } from "../../config/appConfig";
import { Album } from "../../models/album";
import { Song } from "../../models/song";
import { AlbumDocument } from "./albumDAO";
import { DAOException } from "./exceptions/DAOException";
import { AlbumModel } from "./models/albumModel";
import { ArtistModel } from "./models/artistModel";
import { SongDocument } from "./songDAO";
import { SongModel } from "./models/songModel";
import { ArtistMapper } from "../../mappers/artistMapper";
import { Artist } from "../../models/artist";

export type ArtistDocument = Artist & Document<any, any, Artist>;

@injectable()
export class ArtistDAO {
  public async getAllArtistModel(this: ArtistDAO): Promise<ArtistDocument[]> {
    try {
      return await this.artistModel.find()
        .populate<Pick<Artist, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getAllArtistModel", err);
    }
  }

  public async getArtistModel(this: ArtistDAO, id: string): Promise<ArtistDocument> {
    try {
      return await this.artistModel.findById(id)
        .populate<Pick<Artist, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getArtistModel", err);
    }
  }

  public async getSongModelFromArtist(this: ArtistDAO, id: string): Promise<SongDocument[]> {
    try {
      return await this.songModel.find({ artists: id })
        .populate<Pick<Song, "albumV2">>("albumV2")
        .populate<Pick<Song, "artists">>("artists")
    } catch (err) {
      throw new DAOException(__filename, "getSongModelFromArtist", err);
    }
  }

  public async getAlbumModelFromArtist(this: ArtistDAO, id: string): Promise<AlbumDocument[]> {
    try {
      return await this.albumModel.find({ artists: id })
        .populate<Pick<Album, "artists">>("artists")
        .populate<Pick<Album, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getAlbumModelFromArtist", err);
    }
  }

  public async createArtistModel(this: ArtistDAO, artist: Artist): Promise<string> {
    try {
      return await this.artistModel.create(this.artistMapper.toArtistDb(artist))
        .then((a) => a.id)
    } catch (err) {
      throw new DAOException(__filename, "createArtistModel", err);
    }
  }

  public async findArtistModelByName(this: ArtistDAO, name: string): Promise<ArtistDocument[]> {
    try {
      return await this.artistModel.find({ name: name })
        .populate<Pick<Artist, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "findArtistModelByName", err);
    }
  }

  public async updateArtistModel(this: ArtistDAO, artist: Artist): Promise<void> {
    try {
      await this.artistModel.findByIdAndUpdate(artist.id, this.artistMapper.toArtistDb(artist))
    } catch (err) {
      throw new DAOException(__filename, "updateArtistModel", err);
    }
  }

  public async findArtistsByMbids(this: ArtistDAO, mbids: string[]): Promise<ArtistDocument[]> {
    try {
      return await this.artistModel.find({
        mbid: { $in: mbids }
      })
        .populate<Pick<Artist, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "findArtistsByMbids", err)
    }
  }

  public async getArtistModelForMetadataGrabber(this: ArtistDAO): Promise<ArtistDocument[]> {
    try {
      return await this.artistModel.find({
        $or: [
          { lastUpdated: null },
          { lastUpdated: { $lt: Date.now() - UPDATE_METADATA_PERIOD } },
        ],
      })
        .populate<Pick<Artist, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getArtistModelForMetadataGrabber", err)
    }
  }

  constructor(
    private albumModel: AlbumModel,
    private artistModel: ArtistModel,
    private songModel: SongModel,
    private artistMapper: ArtistMapper
  ) { }
}
