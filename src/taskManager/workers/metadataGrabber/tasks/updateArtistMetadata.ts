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

import { artistService } from "../../../../service/artistService"
import { logger } from "../../../../utils/logger"
import { MetadataGrabberException } from "../../exceptions/metadataGrabberException"
import { TaskException } from "../../exceptions/taskException"

export async function updateArtistMetadata() {
  let artists = await artistService.getArtistForMetadataGrabber()
    .catch((err) => { throw new MetadataGrabberException(__filename, "grabMbid", err) })

  for (let i = 0; i < artists.length; i++) {
    try {
      if (!artists[i].mbid) continue

      let artist = await artistService.fetchArtistMetadata(artists[i])

      if (artist.name) artists[i].name = artist.name

      artists[i].lastUpdated = Date.now()

      await artistService.updateArtist(artists[i])
      logger.info(`Updated metadata for artist ${artists[i].id}`, "Metadata Grabber")
    } catch (err) {
      logger.error(new MetadataGrabberException(__filename, "updateArtistMetadata", err))
    }
  }
}