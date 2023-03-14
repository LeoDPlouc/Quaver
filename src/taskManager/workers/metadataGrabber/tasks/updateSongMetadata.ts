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
import { SongMetadata } from "../../../../access/api/DTO/songMetadata";
import { Song } from "../../../../models/song";
import { AlbumService } from "../../../../service/albumService";
import { ArtistService } from "../../../../service/artistService";
import { SongService } from "../../../../service/songService";
import { MetadataGrabberException } from "../../exceptions/metadataGrabberException";
import { Logger } from "../../../../utils/logger";

@injectable()
export class UpdateSongMetadataTask {
  public async doTask() {
    return await this.songService.getSongForMetadataGrabber()
      .then(async (data) => {
        for (let i = 0; i < data.length; i++) {
          if (!data[i].mbid) { continue }
          await this.fetchSongMetadata(data[i])
            .then((data) => this.fetchAlbum(data.song, data.songMetadata))
            .then((data) => this.fetchArtist(data.song, data.songMetadata))
            .then(this.updateSong)
            .catch(err => {
              this.logger.error(new MetadataGrabberException(__filename, "doTask", err));
            })
        }
      })
      .catch((err) => { throw new MetadataGrabberException(__filename, "doTask", err) })
  }

  private async fetchSongMetadata(song: Song) {
    let songMetadata = await this.songService.fetchSongMetadata(song);

    if (songMetadata.title) song.title = songMetadata.title;
    if (songMetadata.artists) song.artists = songMetadata.artists;
    if (songMetadata.year) song.year = songMetadata.year;
    if (songMetadata.n) song.n = songMetadata.n
    song.joinings = songMetadata.joinings
    song.lastUpdated = Date.now();

    return { song, songMetadata }
  }

  private async fetchAlbum(song: Song, songMetadata: SongMetadata) {
    let albumMbid = songMetadata.album.mbid
    if (albumMbid) {
      song.albumV2 = await this.albumService.getAlbumByMbidOrCreate(albumMbid)
    }
    return { song, songMetadata }
  }

  private async fetchArtist(song: Song, songMetadata: SongMetadata) {
    let artistsMbid = songMetadata.artists.map(artist => artist.mbid)
    if (artistsMbid?.length) {
      song.artists = await this.artistService.getArtistsByMbidOrCreate(artistsMbid)
    }
    return song
  }

  private async updateSong(song: Song) {
    await this.songService.updateSong(song);
    this.logger.info(`Updated metadata for song ${song.id}`, "UpdateSongMetadataTask");
  }

  constructor(
    private albumService: AlbumService,
    private artistService: ArtistService,
    private songService: SongService,
    private logger: Logger
  ) { }
}