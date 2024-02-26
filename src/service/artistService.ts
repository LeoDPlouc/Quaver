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

import { inject, injectable, registry } from "tsyringe";
import { Album } from "../models/album";
import { Song } from "../models/song";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ServiceException } from "./exceptions/serviceException";
import { Artist } from "../models/artist";
import { MusicBrainzApiService, MusicBrainzApiServiceToken } from "./interfaces/musicBrainzServiceService.inter";
import { ArtistDAO, ArtistDAOToken } from "../DAO/interfaces/artistDAO.inter";
import { ArtistService, ArtistServiceToken } from "./interfaces/artistService.inter";
import { AlbumMapper, AlbumMapperToken } from "../mappers/interfaces/albumMapper.inter";
import { SongMapper, SongMapperToken } from "../mappers/interfaces/songMapper.inter";
import { ArtistMapper, ArtistMapperToken } from "../mappers/interfaces/artistMapper.inter";
import { Logger, LoggerToken } from "../utils/interfaces/logger.inter";

@injectable()
@registry([{
  token: ArtistServiceToken,
  useClass: ArtistServiceImpl
}])
export class ArtistServiceImpl implements ArtistService {
  public async getAllArtist(): Promise<Artist[]> {
    return await this.artistDao
      .getAllArtistModel()
      .then((result) => result.map(this.artistMapper.toArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllArtist", err);
      });
  }

  public async getArtist(id: string): Promise<Artist> {
    let result = await this.artistDao.getArtistModel(id).catch((err) => {
      throw new ServiceException(__filename, "getArtist", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getArtist", "Artist not found");
    }

    return this.artistMapper.toArtist(result);
  }

  public async getSongFromArtist(id: string): Promise<Song[]> {
    return await this.artistDao
      .getSongModelFromArtist(id)
      .then((result) => result.map(data => this.songMapper.toSong(data)))
      .catch((err) => {
        throw new ServiceException(__filename, "getSongFromArtist", err);
      });
  }

  public async getAlbumFromArtist(id: string): Promise<Album[]> {
    let result = await this.artistDao.getAlbumModelFromArtist(id).catch((err) => {
      throw new ServiceException(__filename, "getAlbumFromArtist", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getAlbumFromArtist", "Artist not found");
    }

    return result.map(data => this.albumMapper.toAlbum(data));
  }

  public async createArtist(artist: Artist): Promise<string> {
    return await this.artistDao.createArtistModel(artist)
      .catch((err) => {
        throw new ServiceException(__filename, "createArtist", err);
      });
  }

  public async findArtistByName(name: string): Promise<Artist[]> {
    return await this.artistDao
      .findArtistModelByName(name)
      .then((result) => result.map(this.artistMapper.toArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "findArtistByName", err);
      });
  }

  public async updateArtist(artist: Artist): Promise<void> {
    return await this.artistDao.updateArtistModel(artist)
      .catch((err) => {
        throw new ServiceException(__filename, "updateArtist", err);
      });
  }

  public async getArtistsByMbidOrCreate(mbids: string[]): Promise<Artist[]> {
    let artists = await this.artistDao.findArtistsByMbids(mbids)
      .then(results => results.map(this.artistMapper.toArtist))
      .catch((err) => {
        throw new ServiceException(__filename, "getArtistsByMbidOrCreate", err);
      });

    let notFoundMbids = mbids.filter(id => !artists.find(a => a.mbid == id))

    for (let i = 0; i < notFoundMbids.length; i++) {
      let id = await this.createArtist({ mbid: notFoundMbids[i] })
      this.logger.info(`Found new artist ${id}`, "Artist Service")
      artists.push({ id, mbid: notFoundMbids[i] })
    }
    return artists
  }

  public async getArtistForMetadataGrabber(): Promise<Artist[]> {
    return await this.artistDao.getArtistModelForMetadataGrabber()
      .then(results => results.map(this.artistMapper.toArtist))
      .catch(err => {
        throw new ServiceException(__filename, "getArtistForMetadataGrabber", err)
      })
  }

  public async fetchArtistMetadata(artist: Artist): Promise<ArtistMetadata> {
    return await this.musicBrainzApiAccess.fetchArtistMetadata(artist.mbid).catch((err) => {
      throw new ServiceException(__filename, "fetchArtistMetadata", err)
    })
  }

  constructor(
    @inject(MusicBrainzApiServiceToken) private musicBrainzApiAccess: MusicBrainzApiService,
    @inject(ArtistDAOToken) private artistDao: ArtistDAO,
    @inject(AlbumMapperToken) private albumMapper: AlbumMapper,
    @inject(SongMapperToken) private songMapper: SongMapper,
    @inject(ArtistMapperToken) private artistMapper: ArtistMapper,
    @inject(LoggerToken) private logger: Logger
  ) { }
}
