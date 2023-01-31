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

import { albumService } from "../../../../service/albumService";
import { artistService } from "../../../../service/artistService";
import { songService } from "../../../../service/songService";
import { logger } from "../../../../utils/logger";
import { MetadataGrabberException } from "../../exceptions/metadataGrabberException";
import { TaskException } from "../../exceptions/taskException";

export async function updateSongMetadata() {
  let songs = await songService.getSongForMetadataGrabber()
    .catch((err) => { throw new MetadataGrabberException(__filename, "grabMbid", err) })

  for (let i = 0; i < songs.length; i++) {
    try {
      if (!songs[i].mbid) continue

      let song = await songService.fetchSongMetadata(songs[i]);

      if (song.title) songs[i].title = song.title;
      if (song.artists) songs[i].artists = song.artists;
      if (song.year) songs[i].year = song.year;
      if (song.n) songs[i].n = song.n
      songs[i].joinings = song.joinings

      let albumMbid = song.album.mbid
      if (albumMbid) {
        songs[i].albumV2 = await albumService.getAlbumByMbidOrCreate(albumMbid)
      }

      let artistsMbid = song.artists.map(artist => artist.mbid)
      if (artistsMbid?.length) {
        songs[i].artists = await artistService.getArtistsByMbidOrCreate(artistsMbid)
      }

      songs[i].lastUpdated = Date.now();

      await songService.updateSong(songs[i]);
      logger.info(`Updated metadata for song ${songs[i].id}`, "Metadata Grabber");
    } catch (err) {
      logger.error(new MetadataGrabberException(__filename, "updateSongMetadata", err));
    }
  }
}