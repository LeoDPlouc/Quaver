// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2024  DPlouc
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

import { Album } from "../models/album";
import { Song } from "../models/song";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ServiceException } from "./exceptions/serviceException";
import { inject, injectable, registry } from "tsyringe"
import { AlbumMapper } from "../mappers/albumMapper";
import { SongMapper } from "../mappers/songMapper";
import { Logger } from "../utils/logger";
import { AlbumMetadata } from "./DTO/albumMetadata";
import { imageFileData } from "./DTO/ImageFileData";
import { AlbumDAO } from "../DAO/interfaces/albumDAO.inter";
import { MusicBrainzApiService } from "./interfaces/musicBrainzServiceService.inter";
import { CoverArtArchiveService, CoverArtArchiveServiceToken } from "./interfaces/coverArtArchiveService.inter";
import { AlbumService, AlbumServiceToken } from "./interfaces/albumService.inter";

@injectable()
@registry([{
  token: AlbumServiceToken,
  useClass: AlbumServiceImpl
}])
export class AlbumServiceImpl implements AlbumService {
  public async getAllAlbums(): Promise<Album[]> {
    return await this.albumDao
      .getAllAlbumModel()
      .then((result) => result.map(data => this.albumMapper.toAlbum(data)))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllAlbums", err);
      });
  }

  public async getAlbum(id: string): Promise<Album> {
    let result = await this.albumDao.getAlbumModel(id).catch((err) => {
      throw new ServiceException(__filename, "getAlbum", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getAlbum", "Album not found");
    }

    return this.albumMapper.toAlbum(result);
  }

  public async getSongFromAlbum(id: string): Promise<Song[]> {
    var result = await this.albumDao.getSongModelFromAlbum(id).catch((err) => {
      throw new ServiceException(__filename, "getAlbumSongs", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getSongFromAlbum", "Album not found");
    }

    return result.map(data => this.songMapper.toSong(data));
  }

  public async createAlbum(album: Album): Promise<string> {
    return await this.albumDao.createAlbumModel(album)
      .catch((err) => {
        throw new ServiceException(__filename, "createAlbum", err);
      });
  }

  public async findAlbumByName(albumTitle: string, artistName?: string): Promise<Album[]> {
    return await this.albumDao
      .findAlbumModelByName(albumTitle, artistName)
      .then((result) => result.map(data => this.albumMapper.toAlbum(data)))
      .catch((err) => {
        throw new ServiceException(__filename, "findAlbumByName", err);
      });
  }

  public async updateAlbum(album: Album): Promise<void> {
    await this.albumDao.updateAlbumModel(album)
      .catch((err) => {
        throw new ServiceException(__filename, "updateAlbum", err);
      });
  }

  public async getAlbumToCoverGrab(): Promise<Album[]> {
    return await this.albumDao
      .getAlbumModelToCoverGrab()
      .then((result) => result.map(data => this.albumMapper.toAlbum(data)))
      .catch((err) => {
        throw new ServiceException(__filename, "getAlbumToCoverGrab", err);
      });
  }

  public async fetchAlbumMetadata(album: Album): Promise<AlbumMetadata> {
    return await this.musicBrainzApiService.fetchAlbumMetadata(album.mbid).catch((err) => {
      throw new ServiceException(__filename, "fetchAlbumMetadata", err)
    });
  }

  public async fetchAlbumCover(album: Album): Promise<imageFileData> {
    return await this.coverArtArchiveService.fetchAlbumCover(album.mbid)
      .catch(err => {
        throw new ServiceException(__filename, "fetchAlbumCover", err)
      })
  }

  public async getAlbumByMbidOrCreate(mbid: string): Promise<Album> {
    let albums = await this.albumDao.findAlbumsByMbid(mbid)
      .then(results => results.map(this.albumMapper.toAlbum))
      .catch((err) => {
        throw new ServiceException(__filename, "findAlbumsByMbid", err);
      });

    if (albums.length) {
      return albums[0]
    } else {
      let id = await this.createAlbum({ mbid })
      this.logger.info(`Found new album ${id}`, "Album Service")
      return { id, mbid }
    }
  }

  public async getAlbumForMetadataGrabber(): Promise<Album[]> {
    return await this.albumDao.getAlbumModelForMetadataGrabber()
      .then(results => results.map(this.albumMapper.toAlbum))
      .catch(err => {
        throw new ServiceException(__filename, "getAlbumForMetadataGrabber", err)
      })
  }

  constructor(
    @inject(CoverArtArchiveServiceToken) private coverArtArchiveService: CoverArtArchiveService,
    private musicBrainzApiService: MusicBrainzApiService,
    private albumDao: AlbumDAO,
    private albumMapper: AlbumMapper,
    private songMapper: SongMapper,
    private logger: Logger
  ) { }
}
