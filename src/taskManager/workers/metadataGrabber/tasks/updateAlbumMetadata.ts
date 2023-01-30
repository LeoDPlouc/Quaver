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

import { albumService } from "../../../../service/albumService"
import { artistService } from "../../../../service/artistService"
import { logger } from "../../../../utils/logger"
import { TaskException } from "../../exceptions/taskException"

export async function updateAlbumMetadata() {
    let albums = await albumService.getAlbumForMetadataGrabber()
  
    for (let i = 0; i < albums.length; i++) {
      try {
        if (!albums[i].mbid) continue
  
        let album = await albumService.fetchAlbumMetadata(albums[i])
        if (album.artists) albums[i].artists = album.artists
        if (album.title) albums[i].title = album.title
        if (album.year) albums[i].year = album.year
        albums[i].joinings = album.joinings
  
        let artistsMbid = album.artists.map(artist => artist.mbid)
        if (artistsMbid?.length) {
          albums[i].artists = await artistService.getArtistsByMbidOrCreate(artistsMbid)
        }
  
        albums[i].lastUpdated = Date.now()
  
        await albumService.updateAlbum(albums[i])
        logger.info(`Updated metadata for album ${albums[i].id}`, "Metadata Grabber")
      } catch (err) {
        logger.error(new TaskException(__filename, "updateAlbumMetadata", err))
      }
    }
  }