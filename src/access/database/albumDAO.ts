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
import { inject, injectable } from "tsyringe";
import { UPDATE_COVER_PERIOD, UPDATE_METADATA_PERIOD } from "../../config/appConfig";
import { Album } from "../../models/album";
import { Song } from "../../models/song";
import { DAOException } from "./exceptions/DAOException";
import { SongDocument } from "./songDAO";
import { SongModel } from "./models/songModel";
import { AlbumMapper } from "../../mappers/albumMapper";
import { AlbumModel } from "./models/albumModel";

export type AlbumDocument = Album & Document<any, any, Album>;

@injectable()
export class AlbumDAO {
  public async getAllAlbumModel(this: AlbumDAO): Promise<AlbumDocument[]> {
    try {
      return await this.albumModel.find()
        .populate<Pick<Album, "artists">>("artists")
        .populate<Pick<Album, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getAllAlbumModel", err);
    }
  }

  public async getAlbumModel(this: AlbumDAO, id: string): Promise<AlbumDocument> {
    try {
      return await this.albumModel.findById(id)
        .populate<Pick<Album, "artists">>("artists")
        .populate<Pick<Album, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getAlbumModel", err);
    }
  }

  public async getSongModelFromAlbum(this: AlbumDAO, id: string): Promise<SongDocument[]> {
    try {
      return await this.songModel.find({ albumV2: id })
        .populate<Pick<Song, "albumV2">>("albumV2")
        .populate<Pick<Song, "artists">>("artists")
    } catch (err) {
      throw new DAOException(__filename, "getSongModelFromAlbum", err);
    }
  }

  public async createAlbumModel(this: AlbumDAO, album: Album): Promise<string> {
    try {
      return await this.albumModel.create(this.albumMapper.toAlbumDb(album))
        .then((a) => a.id)
    } catch (err) {
      throw new DAOException(__filename, "createAlbumModel", err);
    }
  }

  public async findAlbumModelByName(this: AlbumDAO, albumTitle: string, artistName?: string): Promise<AlbumDocument[]> {
    let query: Album = { title: albumTitle, artist: artistName };
    try {
      return await this.albumModel.find(query)
        .populate<Pick<Album, "artists">>("artists")
        .populate<Pick<Album, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "findAlbumModelByName", err);
    }
  }

  public async updateAlbumModel(this: AlbumDAO, album: Album): Promise<void> {
    try {
      await this.albumModel.findByIdAndUpdate(album.id, this.albumMapper.toAlbumDb(album))
    } catch (err) {
      throw new DAOException(__filename, "updateAlbumModel", err);
    }
  }

  public async getAlbumModelToCoverGrab(this: AlbumDAO): Promise<AlbumDocument[]> {
    try {
      return await this.albumModel.find({
        $or: [
          { coverV2: { $eq: null } },
          { lastCoverUpdate: null },
          { lastCoverUpdate: { $lt: Date.now() - UPDATE_COVER_PERIOD } },
        ],
      })
        .populate<Pick<Album, "artists">>("artists")
        .populate<Pick<Album, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getAlbumModelToCoverGrab", err);
    }
  }

  public async findAlbumsByMbid(this: AlbumDAO, mbid: string): Promise<AlbumDocument[]> {
    try {
      return await this.albumModel.find({ mbid: mbid })
        .populate<Pick<Album, "artists">>("artists")
        .populate<Pick<Album, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "findAlbumsByMbid", err);
    }
  }

  public async getAlbumModelForMetadataGrabber(this: AlbumDAO): Promise<AlbumDocument[]> {
    try {
      return await this.albumModel.find({
        $or: [
          { lastUpdated: null },
          { lastUpdated: { $lt: Date.now() - UPDATE_METADATA_PERIOD } },
        ],
      })
        .populate<Pick<Album, "artists">>("artists")
        .populate<Pick<Album, "coverV2">>("coverV2")
    } catch (err) {
      throw new DAOException(__filename, "getAlbumModelForMetadataGrabber", err)
    }
  }

  constructor(
    private albumModel: AlbumModel,
    private songModel: SongModel,
    private albumMapper: AlbumMapper
  ) { }
}

