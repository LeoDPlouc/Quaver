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
import { artistService } from "../../service/artistService";
import { fileService } from "../../service/fileService";
import { songService } from "../../service/songService";
import { logger } from "../../utils/logger";
import { TaskException } from "./exceptions/taskException";

async function grabMbid() {
  let songs = await songService.getMbidlessSong();

  for (let i = 0; i < songs.length; i++) {
    try {
      let songData = await fileService.getMetadataFromFile(songs[i].path)
      let mbid = await songService.fetchSongMBId(songData);
      if (!mbid) continue; //Pass if no Mbid have been found

      songs[i].mbid = mbid;
      await songService.updateSong(songs[i]);

      logger.info(`Found Mbid for song ${songs[i].id}`, "Metadata Grabber");
    } catch (err) {
      logger.error(new TaskException(__filename, "grabMbid", err));
      logger.debug(1, `SongData : ${JSON.stringify(songs[i])}`, "metadataGrabber")
    }
  }
}

async function updateSongMetadata() {
  let songs = await songService.getSongForMetadataGrabber();

  for (let i = 0; i < songs.length; i++) {
    try {
      if (!songs[i].mbid) continue

      let { song, albumMbid, artistsMbid } = await songService.fetchSongMetadata(songs[i]);

      if (song.title) songs[i].title = song.title;
      if (song.artist) songs[i].artist = song.artist;
      if (song.year) songs[i].year = song.year;
      if (song.n) songs[i].n = song.n

      if (albumMbid) {
        songs[i].albumV2 = await albumService.getAlbumByMbidOrCreate(albumMbid)
      }

      if (artistsMbid?.length) {
        songs[i].artists = await artistService.getArtistsByMbidOrCreate(artistsMbid)
      }

      songs[i].lastUpdated = Date.now();

      await songService.updateSong(songs[i]);
      logger.info(`Updated metadata for song ${songs[i].id}`, "Metadata Grabber");
    } catch (err) {
      logger.error(new TaskException(__filename, "updateSongMetadata", err));
    }
  }
}

async function updateAlbumMetadata() {
  let albums = await albumService.getAlbumForMetadataGrabber()

  for (let i = 0; i < albums.length; i++) {
    try {
      if (!albums[i].mbid) continue

      let { album, artistsMbid } = await albumService.fetchAlbumMetadata(albums[i])

      if (album.artist) albums[i].artist = album.artist
      if (album.title) albums[i].title = album.title
      if (album.year) albums[i].year = album.year

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

async function updateArtistMetadata() {
  let artists = await artistService.getArtistForMetadataGrabber()

  for (let i = 0; i < artists.length; i++) {
    try {
      if (!artists[i].mbid) continue

      let artist = await artistService.fetchArtistMetadata(artists[i])

      if (artist.name) artists[i].name = artist.name

      artists[i].lastUpdated = Date.now()

      await artistService.updateArtist(artists[i])
      logger.info(`Updated metadata for artist ${artists[i].id}`, "Metadata Grabber")
    } catch (err) {
      logger.error(new TaskException(__filename, "updateArtistMetadata", err))
    }
  }
}

export default async function doWork() {
  logger.info("Metadata grabber started", "Metadata Grabber");
  try {
    await grabMbid();
    await updateSongMetadata();
    await updateAlbumMetadata()
    await updateArtistMetadata()
  } catch (err) {
    logger.error(new TaskException(__filename, "doWork", err))
  }
}
