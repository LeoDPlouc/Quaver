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

import { coverArtArchiveAccess } from "../access/api/coverArtArchive";
import { imageFileData } from "../access/api/DTO/ImageFileData";
import { musicBrainzApiAccess } from "../access/api/musicbrainzApi";
import { albumDAO } from "../access/database/albumDAO";
import { mapAlbum } from "../mappers/albumMapper";
import { mapSong } from "../mappers/songMapper";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ServiceException } from "./exceptions/serviceException";

class AlbumService {
  public async getAllAlbums(this: AlbumService): Promise<Album[]> {
    return await albumDAO
      .getAllAlbumModels()
      .then((result) => result.map(mapAlbum))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllAlbums", err);
      });
  }

  public async getAlbum(this: AlbumService, id: string): Promise<Album> {
    let result = await albumDAO.getAlbumModel(id).catch((err) => {
      throw new ServiceException(__filename, "getAlbum", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getAlbum", "Album not found");
    }

    return mapAlbum(result);
  }

  public async getAlbumSongs(this: AlbumService, id: string): Promise<Song[]> {
    var result = await albumDAO.getAlbumSongModel(id).catch((err) => {
      throw new ServiceException(__filename, "getAlbumSongs", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getAlbumSongs", "Album not found");
    }

    return result.map(mapSong);
  }

  public async createAlbum(this: AlbumService, album: Album): Promise<string> {
    return await albumDAO.createAlbumModel(album).catch((err) => {
      throw new ServiceException(__filename, "createAlbum", err);
    });
  }

  public async findAlbumByName(this: AlbumService, albumTitle: string, artistName?: string): Promise<Album[]> {
    return await albumDAO
      .findAlbumModelByName(albumTitle, artistName)
      .then((result) => result.map(mapAlbum))
      .catch((err) => {
        throw new ServiceException(__filename, "findAlbumByName", err);
      });
  }

  public async updateAlbum(this: AlbumService, album: Album): Promise<void> {
    await albumDAO.updateAlbumModel(album).catch((err) => {
      throw new ServiceException(__filename, "updateAlbum", err);
    });
  }

  public async getMbidlessAlbum(this: AlbumService): Promise<Album[]> {
    return await albumDAO
      .getMbidlessAlbumModels()
      .then((result) => result.map(mapAlbum))
      .catch((err) => {
        throw new ServiceException(__filename, "getMbidlessAlbum", err);
      });
  }

  public async getToCoverGrabAlbums(this: AlbumService): Promise<Album[]> {
    return await albumDAO
      .getToCoverGrabAlbumsModels()
      .then((result) => result.map(mapAlbum))
      .catch((err) => {
        throw new ServiceException(__filename, "getToCoverGrabAlbums", err);
      });
  }

  public async getAlbumMbid(this: AlbumService, album: Album): Promise<string[]> {
    return await musicBrainzApiAccess.getMBId(album).catch((err) => {
      throw new ServiceException(__filename, "getAlbumMbid", err);
    });
  }

  public async getAlbumMetadata(this: AlbumService, album: Album): Promise<Album> {
    return await musicBrainzApiAccess.getMetadataFromMB(album.mbids);
  }

  public async getUpdatableAlbum(this: AlbumService): Promise<Album[]> {
    return await albumDAO.getUpdatableAlbumModels().catch((err) => {
      throw new ServiceException(__filename, "getUpdatableAlbum", err);
    });
  }

  public async getCover(this: AlbumService, album: Album): Promise<imageFileData> {
    return await coverArtArchiveAccess.getAlbumCover(album.mbids);
  }
}

export const albumService = new AlbumService();
