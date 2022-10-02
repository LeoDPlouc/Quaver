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

import { albumService } from "../../service/albumService";
import { songService } from "../../service/songService";
import { logger } from "../../utils/logger";
import { TaskException } from "./exceptions/taskException";

async function grabMbids() { // DEPRECATED
  let songs = await songService.getMbidlessSongs();

  for (let i = 0; i < songs.length; i++) {
    try {
      let mbids = await songService.getSongMbids(songs[i]);
      if (!mbids.length) continue; //Pass if no Mbid have been found

      songs[i].mbids = mbids;
      await songService.updateSong(songs[i]);

      logger.info(`Found Mbids for song ${songs[i].id}`, "Metadata Grabber");
    } catch (err) {
      logger.error(new TaskException(__filename, "grabMbids", err));
      logger.debug(1, `SongData : ${JSON.stringify(songs[i])}`, "metadataGrabber")
    }
  }
}

async function updateSongMetadata() {
  let songs = await songService.metadataGrabberGet();

  for (let i = 0; i < songs.length; i++) {
    try {
      if (!songs[i].mbids.length) continue

      let metadata = await songService.getSongMetadata(songs[i]);

      if (metadata.title) songs[i].title = metadata.title;
      if (metadata.artist) songs[i].artist = metadata.artist;
      if (metadata.year) songs[i].year = metadata.year;
      if (metadata.n) songs[i].n = metadata.n

      songs[i].lastUpdated = Date.now();

      await songService.updateSong(songs[i]);
      logger.info(`Updated metadata for song ${songs[i].id}`, "Metadata Grabber");
    } catch (err) {
      logger.error(new TaskException(__filename, "updateSongMetadata", err));
    }
  }
}

async function updateMetadata() {
  let albums = await albumService.getUpdatableAlbum();

  for (let i = 0; i < albums.length; i++) {
    try {
      let metadata = await albumService.getAlbumMetadata(albums[i]);

      if (metadata.title) albums[i].title = metadata.title;
      if (metadata.artist) albums[i].artist = metadata.artist;
      if (metadata.year) albums[i].year = metadata.year;

      albums[i].lastUpdated = Date.now();

      await albumService.updateAlbum(albums[i]);
      logger.info(`Updated metadata for ${albums[i].id}`, "Metadata Grabber");
    } catch (err) {
      logger.error(new TaskException(__filename, "updateMetadata", err));
    }
  }
}

export default async function doWork() {
  logger.info("Metadata grabber started", "Metadata Grabber");
  try {
    await grabMbids();
    await updateSongMetadata();
  } catch (err) {
    logger.error(new TaskException(__filename, "doWork", err))
  }
}
