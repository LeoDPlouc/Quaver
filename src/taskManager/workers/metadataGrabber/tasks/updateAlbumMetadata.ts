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

import { injectable } from "tsyringe"
import { AlbumMetadata } from "../../../../access/api/DTO/albumMetadata"
import { Album } from "../../../../models/album"
import { AlbumService } from "../../../../service/albumService"
import { ArtistService } from "../../../../service/artistService"
import { MetadataGrabberException } from "../../exceptions/metadataGrabberException"
import { Logger } from "../../../../utils/logger"

@injectable()
export class UpdateAlbumMetadataTask {
  public async doTask() {
    return await this.albumService.getAlbumForMetadataGrabber()
      .then(async data => {
        for (let i = 0; i < data.length; i++) {
          if (!data[i].mbid) { continue }

          await this.fetchAlbumMetadata(data[i])
            .then((data) => this.fetchArtist(data.album, data.albumMetadata))
            .then(this.updateAlbum)
            .catch(err => {
              this.logger.error(new MetadataGrabberException(__filename, "doTask", err))
            })
        }
      })
      .catch((err) => { throw new MetadataGrabberException(__filename, "doTask", err) })
  }

  private async fetchAlbumMetadata(album: Album) {
    let albumMetadata = await this.albumService.fetchAlbumMetadata(album)
    if (albumMetadata.artists) album.artists = albumMetadata.artists
    if (albumMetadata.title) album.title = albumMetadata.title
    if (albumMetadata.year) album.year = albumMetadata.year
    album.joinings = album.joinings
    album.lastUpdated = Date.now()

    return { album, albumMetadata }
  }

  private async fetchArtist(album: Album, albumMetadata: AlbumMetadata) {
    let artistsMbid = albumMetadata.artists.map(artist => artist.mbid)
    if (artistsMbid?.length) {
      album.artists = await this.artistService.getArtistsByMbidOrCreate(artistsMbid)
    }

    return album
  }

  private async updateAlbum(album: Album) {
    await this.albumService.updateAlbum(album)
    this.logger.info(`Updated metadata for album ${album.id}`, "Metadata Grabber")
  }

  constructor(
    private albumService: AlbumService,
    private artistService: ArtistService,
    private logger: Logger
    ) { }
}