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

import {
  coverArtArchiveAccess,
  imageFileData,
} from "../access/api/coverArtArchive";
import { musicBrainzApiAccess } from "../access/api/musicbrainzApi";
import { albumDAO } from "../access/database/albumDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapSong } from "../mappers/songMapper";
import { createFailure } from "../utils/Failure";

class AlbumService {
  public async getAllAlbums(this: AlbumService): Promise<Album[]> {
    try {
      var result = await albumDAO.getAllAlbumModels();
    } catch (err) {
      throw createFailure("DAO error", __filename, this.getAllAlbums.name, err);
    }

    return result.map((a) => mapAlbum(a));
  }

  public async getAlbum(this: AlbumService, id: string): Promise<Album> {
    try {
      var result = await albumDAO.getAlbumModel(id);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.getAlbum.name, err);
    }

    if (!result) {
      throw createFailure("Invalid Id", __filename, this.getAlbum.name);
    }

    return mapAlbum(result);
  }

  public async getAlbumSongs(this: AlbumService, id: string): Promise<Song[]> {
    try {
      var result = await albumDAO.getAlbumSongModel(id);
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.getAlbumSongs.name,
        err
      );
    }

    if (!result) {
      throw createFailure("Invalid Id", __filename, this.getAlbumSongs.name);
    }

    return result.map((s) => mapSong(s));
  }

  public async createAlbum(this: AlbumService, album: Album): Promise<string> {
    try {
      var result = await albumDAO.createAlbumModel(album);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.createAlbum.name, err);
    }

    return result;
  }

  public async findAlbumByName(
    this: AlbumService,
    albumTitle: string,
    artistName?: string
  ): Promise<Album[]> {
    try {
      var result = await albumDAO.findAlbumModelByName(albumTitle, artistName);
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.findAlbumByName.name,
        err
      );
    }

    return result.map((a) => mapAlbum(a));
  }

  public async updateAlbum(this: AlbumService, album: Album): Promise<void> {
    try {
      await albumDAO.updateAlbumModel(album);
    } catch (err) {
      throw createFailure("DAO error", __filename, this.updateAlbum.name, err);
    }
  }

  public async getMbidlessAlbum(this: AlbumService): Promise<Album[]> {
    try {
      var result = await albumDAO.getMbidlessAlbumModels();
    } catch (err) {
      throw createFailure("DAO error", __filename, this.getMbidlessAlbum.name);
    }

    return result.map((a) => mapAlbum(a));
  }

  public async getToCoverGrabAlbums(this: AlbumService): Promise<Album[]> {
    try {
      var result = await albumDAO.getToCoverGrabAlbumsModels();
    } catch (err) {
      throw createFailure(
        "DAO error",
        __filename,
        this.getToCoverGrabAlbums.name,
        err
      );
    }

    return result.map((a) => mapAlbum(a));
  }

  public async getAlbumMbid(
    this: AlbumService,
    album: Album
  ): Promise<string[]> {
    try {
      return musicBrainzApiAccess.getMBId(album);
    } catch (err) {
      throw createFailure("API error", __filename, this.getAlbumMbid.name);
    }
  }

  public async getAlbumMetadata(
    this: AlbumService,
    album: Album
  ): Promise<Album> {
    return musicBrainzApiAccess.getMetadataFromMB(album.mbids);
  }

  public async getUpdatableAlbum(this: AlbumService): Promise<Album[]> {
    try {
      return await albumDAO.getUpdatableAlbumModels();
    } catch (err) {
      throw createFailure("DAO error", __filename, this.getUpdatableAlbum.name);
    }
  }

  public async getCover(
    this: AlbumService,
    album: Album
  ): Promise<imageFileData> {
    return await coverArtArchiveAccess.getAlbumCover(album.mbids);
  }
}

export const albumService = new AlbumService();
