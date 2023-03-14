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
import { Song } from "../../../../models/song";
import { SongService } from "../../../../service/songService";
import { NotFoundException } from "../../../../utils/exceptions/notFoundException";
import { MetadataGrabberException } from "../../exceptions/metadataGrabberException";
import { FileService } from "../../../../service/fileService";
import { Logger } from "../../../../utils/logger";

@injectable()
export class GrabMbIDTask {
  public async doTask() {
    return await this.songService.getMbidlessSong()
      .then(async (data) => {
        for (let i = 0; i < data.length; i++) {
          await this.fetchBaseMetadata(data[i])
            .then(this.updateSong)
            .catch(err => {
              this.logger.error(new MetadataGrabberException(__filename, "grabMbid", err));
              this.logger.debug(1, `SongData : ${JSON.stringify(data[i])}`, "metadataGrabber")
            })
        }
      })
      .catch((err) => { throw new MetadataGrabberException(__filename, "grabMbid", err) });
  }

  private async fetchBaseMetadata(song: Song) {
    let songMetadata = await this.fileService.getMetadataFromFile(song.path)
    let mbid = await this.songService.fetchSongMBId(songMetadata);
    if (!mbid) {
      throw new NotFoundException(__filename, "fetchBaseMetadata", "No MbID have been found")
    }

    return { song, songMetadata, mbid }
  }

  private async updateSong(data: { song: Song, songMetadata: SongData, mbid: string }) {
    data.song.mbid = data.mbid;
    await this.songService.updateSong(data.song);

    this.logger.info(`Found Mbid for song ${data.song.id}`, "Metadata Grabber");
  }

  constructor(
    private songService: SongService,
    private fileService: FileService,
    private logger: Logger
  ) { }
}