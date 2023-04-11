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
import { ArtistService } from "../../../../service/artistService"
import { MetadataGrabberException } from "../../exceptions/metadataGrabberException"
import { Logger } from "../../../../utils/logger"

@injectable()
export class UpdateArtistMetadataTask {
  public async doTask() {
    return await this.artistService.getArtistForMetadataGrabber()
      .then(async (data) => {
        for (let i = 0; i < data.length; i++) {
          if (!data[i].mbid) { continue }

          await this.fetchArtistMetadata(data[i])
            .then(data => this.updateArtist(data))
            .catch(err => {
              this.logger.error(new MetadataGrabberException(__filename, "updateArtistMetadata", err))
            })
        }
      })
      .catch((err) => { throw new MetadataGrabberException(__filename, "grabMbid", err) })

  }

  private async fetchArtistMetadata(artist: Artist) {
    let artistMetadata = await this.artistService.fetchArtistMetadata(artist)

    if (artistMetadata.name) { artist.name = artistMetadata.name }
    artist.lastUpdated = Date.now()

    return artist
  }

  private async updateArtist(artist: Artist) {
    await this.artistService.updateArtist(artist)
    this.logger.info(`Updated metadata for artist ${artist.id}`, "Metadata Grabber")
  }

  constructor(
    private artistService: ArtistService,
    private logger: Logger
  ) { }
}