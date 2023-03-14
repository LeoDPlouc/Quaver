// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2023  DPlouc
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

import { injectable } from "tsyringe";
import { MUSIC_PATH } from "../../../../config/config";
import { Song } from "../../../../models/song";
import { SongService } from "../../../../service/songService";
import { SongCollectorException } from "../../exceptions/songCollectorException";
import { FileService } from "../../../../service/fileService";
import { Logger } from "../../../../utils/logger";

@injectable()
export class CollectTask {
  public async doTask() {
    return await this.fetchData()
      .then(data => {
        for (let i = 0; i < data.paths.length; i++) {
          if (!this.fileService.isMusicFile(data.paths[i])) { continue }; //Only consider audio files
          if (data.songPaths.find((p) => p == data.paths[i])) { continue }; //Pass if song already exists

          this.fetchMetadata(data.paths[i])
            .then(this.createSong)
            .catch(err => {
              this.logger.error(new SongCollectorException(__filename, "doTask", err));
            })
        }
      })
      .catch((err) => { throw new SongCollectorException(__filename, "doTask", err) })
  }

  private async fetchData() {
    let songPaths = await this.songService.getPathsFromAllSong()
    let paths = await this.fileService.getAllFiles(MUSIC_PATH);

    return { songPaths, paths }
  }

  private async fetchMetadata(path: string) {
    let songData = await this.fileService.getMetadataFromFile(path);
    let song: Song = { path: path, duration: songData.duration, year: songData.year, title: songData.title }

    return song
  }

  private async createSong(song: Song) {
    await this.songService.createSong(song);
    this.logger.info(`Found new song ${song.path}`, "Song Collector");
  }

  constructor(
    private songService: SongService,
    private fileService: FileService,
    private logger: Logger
  ) { }
}