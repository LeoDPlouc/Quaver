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
import { createFailure } from "../../utils/Failure";
import { albumModel } from "./models/albumModel";
import { songModel } from "./models/songModel";

class AlbumDAO {
  public async getAllAlbumModels(
    this: AlbumDAO
  ): Promise<(Album & Document<any, any, Album>)[]> {
    try {
      return await albumModel.find();
    } catch (err) {
      throw createFailure(err, __filename, this.getAllAlbumModels.name);
    }
  }

  public async getAlbumModel(
    this: AlbumDAO,
    id: string
  ): Promise<Album & Document<any, any, Album>> {
    try {
      return await albumModel.findById(id);
    } catch (err) {
      throw createFailure(err, __filename, this.getAlbumModel.name);
    }
  }

  public async getAlbumSongModel(
    this: AlbumDAO,
    id: string
  ): Promise<(Song & Document<any, any, Song>)[]> {
    try {
      return await songModel.find({ albumId: id });
    } catch (err) {
      throw createFailure(err, __filename, this.getAlbumSongModel.name);
    }
  }

  public async createAlbumModel(this: AlbumDAO, album: Album): Promise<string> {
    try {
      return (await albumModel.create(album)).id;
    } catch (err) {
      throw createFailure(err, __filename, this.createAlbumModel.name);
    }
  }

  public async findAlbumModelByName(
    this: AlbumDAO,
    albumTitle: string,
    artistName?: string
  ): Promise<(Album & Document<any, any, Album>)[]> {
    var query: Album = { title: albumTitle };
    if (artistName) query.artist = artistName;

    try {
      return await albumModel.find(query);
    } catch (err) {
      throw createFailure(err, __filename, this.findAlbumModelByName.name);
    }
  }

  public async updateAlbumModel(this: AlbumDAO, album: Album): Promise<void> {
    try {
      await albumModel.findByIdAndUpdate(album.id, album);
    } catch (err) {
      throw createFailure(err, __filename, this.updateAlbumModel.name);
    }
  }

  public async getMbidlessAlbumModels(
    this: AlbumDAO
  ): Promise<(Album & Document<any, any, Album>)[]> {
    try {
      return await albumModel.find({ mbids: { $size: 0 } });
    } catch (err) {
      throw createFailure(err, __filename, this.getMbidlessAlbumModels.name);
    }
  }

  public async getUpdatableAlbumModels(
    this: AlbumDAO
  ): Promise<(Album & Document<any, any, Album>)[]> {
    try {
      return await albumModel.find({
        $or: [
          { lastUpdated: { $lt: Date.now() - 1000 * 60 * 60 * 24 * 7 } },
          { lastUpdated: { $exists: false } },
          { lastUpdated: null },
        ],
      });
    } catch (err) {
      throw createFailure(err, __filename, this.getUpdatableAlbumModels.name);
    }
  }

  public async getToCoverGrabAlbumsModels(
    this: AlbumDAO
  ): Promise<(Album & Document<any, any, Album>)[]> {
    try {
      return await albumModel.find({
        $or: [
          { cover: { $eq: null } },
          { lastCoverUpdate: null },
          { lastCoverUpdate: { $lt: Date.now() - 1000 * 60 * 60 * 24 * 7 } },
        ],
      });
    } catch (err) {
      throw createFailure(
        err,
        __filename,
        this.getToCoverGrabAlbumsModels.name
      );
    }
  }
}

export const albumDAO = new AlbumDAO();
