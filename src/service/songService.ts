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

import { injectable, registry } from "tsyringe";
import { Song } from "../models/song";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ServiceException } from "./exceptions/serviceException";
import { SongMetadata } from "./DTO/songMetadata";
import { MusicBrainzApiService, MusicBrainzApiServiceToken } from "./interfaces/musicBrainzServiceService.inter";
import { SongDAO, SongDAOToken } from "../DAO/interfaces/songDAO.inter";
import { SongService, SongServiceToken } from "./interfaces/songService.inter";
import { inject } from "vue";
import { SongMapper, SongMapperToken } from "../mappers/interfaces/songMapper.inter";

@injectable()
@registry([{
  token: SongServiceToken,
  useClass: SongServiceImpl
}])
export class SongServiceImpl implements SongService {
  public async getAllSong(): Promise<Song[]> {
    return await this.songDAO
      .getAllSongModel()
      .then((result) => result.map(data => this.songMapper.toSong(data)))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllSong", err);
      });
  }

  public async getSong(id: string): Promise<Song> {
    let result = await this.songDAO
      .getSongModel(id).catch((err) => {
        throw new ServiceException(__filename, "getSong", err);
      });

    if (!result) {
      throw new NotFoundException(__filename, "getSong", "Song not found");
    }

    return this.songMapper.toSong(result);
  }

  public async updateSong(song: Song): Promise<void> {
    await this.songDAO
      .updateSongModel(song)
      .catch((err) => {
        throw new ServiceException(__filename, "updateSong", err);
      });
  }

  public async createSong(song: Song): Promise<string> {
    return await this.songDAO
      .createSongModel(song)
      .catch((err) => {
        throw new ServiceException(__filename, "createSong", err);
      });
  }

  public async findSongByPath(path: string): Promise<Song> {
    let result = await this.songDAO
      .findSongModelByPath(path).catch((err) => {
        throw new ServiceException(__filename, "findSongByPath", err);
      });

    if (!result) {
      throw new NotFoundException(__filename, "findSongByPath", "Song not found");
    }

    return this.songMapper.toSong(result);
  }

  public async getPathsFromAllSong(): Promise<string[]> {
    return await this.songDAO
      .getPathsFromAllSong().catch((err) => {
        throw new ServiceException(__filename, "getPathsFromAllSong", err);
      });
  }

  public async fetchSongMBId(song: SongData): Promise<string> {
    return await this.musicBrainzApiAccess
      .fetchSongMBId(song).catch(err => {
        throw new ServiceException(__filename, "fetchSongMBId", err)
      })
  }

  public async getMbidlessSong(): Promise<Song[]> {
    return await this.songDAO
      .getMbidlessSongModel()
      .then((result) => result.map(this.songMapper.toSong))
      .catch((err) => {
        throw new ServiceException(__filename, "getMbidlessSong", err);
      });
  }

  public async getSongForMetadataGrabber(): Promise<Song[]> {
    return await this.songDAO
      .getSongModelForMetadataGrabber()
      .then((result) => result.map(this.songMapper.toSong))
      .catch((err) => {
        throw new ServiceException(__filename, "getSongForMetadataGrabber", err);
      });
  }

  public async fetchSongMetadata(song: Song): Promise<SongMetadata> {
    return await this.musicBrainzApiAccess.fetchSongMetadata(song.mbid)
      .catch(err => {
        throw new ServiceException(__filename, "fetchSongMetadata", err)
      })
  }

  constructor(
    @inject(MusicBrainzApiServiceToken) private musicBrainzApiAccess: MusicBrainzApiService,
    @inject(SongDAOToken) private songDAO: SongDAO,
    @inject(SongMapperToken) private songMapper: SongMapper
  ) { }
}
