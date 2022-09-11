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

import { MUSIC_PATH } from "../../config/config";
import { logger } from "../../utils/logger";
import { albumService } from "../../service/albumService";
import { songService } from "../../service/songService";
import { artistService } from "../../service/artistService";
import { fileService } from "../../service/fileService";
import { TaskException } from "./exceptions/taskException";

let songPaths: string[];
let artists: Artist[];
let albums: Album[];

async function collect() {
  try {
    var paths = await fileService.getAllFiles(MUSIC_PATH);
  } catch (err) {
    throw new TaskException(__filename, "collect", err);
  }

  for (let i = 0; i < paths.length; i++) {
    try {
      if (fileService.isMusicFile(paths[i])) continue; //Only consider audio files

      if (songPaths.find((p) => p == paths[i])) continue; //Pass if song already exists

      let song = await songService.getMetadataFromFile(paths[i]);

      logger.info(`Found new song ${song.path}`, "Song Collector");

      //Fetch the song's album
      let album = findAlbumByName(song.album, song.artist);
      let albumId = album?.id;
      if (!album) {
        album = { artist: song.artist, title: song.album, year: song.year };

        albumId = await albumService.createAlbum(album);

        logger.info(`Found new album ${album.title}`, "Song Collector");

        await updateAlbums();
      }

      //Fetch the song's artist
      let artist = findArtistByName(song.artist);
      let artistId = artist?.id;
      if (!artist) {
        artist = { name: song.artist };

        artistId = await artistService.createArtist(artist);

        logger.info(`Found new artist ${artist.name}`, "Song Collector");

        await updateArtists();
      }

      album.artistId = artistId;
      await albumService.updateAlbum(album);

      song.artistId = artistId;
      song.albumId = albumId;
      await songService.createSong(song);
    } catch (err) {
      logger.error(new TaskException(__filename, "collect", err));
    }
  }
}

async function updatePaths(): Promise<void> {
  songPaths = await songService.getAllSongPaths().catch((err) => {
    throw new TaskException(__filename, "updatePaths", err);
  });
}

async function updateAlbums(): Promise<void> {
  albums = await albumService.getAllAlbums().catch((err) => {
    throw new TaskException(__filename, "updateAlbums", err);
  });
}

async function updateArtists(): Promise<void> {
  artists = await artistService.getAllArtists().catch((err) => {
    throw new TaskException(__filename, "updateArtists", err);
  });
}

function findArtistByName(artist: string): Artist {
  return artists.find((a) => a.name == artist);
}

function findAlbumByName(album: string, artist: string) {
  if (artist) {
    return albums.find((a) => a.title == album && a.artist == artist);
  } else {
    return albums.find((a) => a.title == album);
  }
}

export default async function doWork() {
  logger.info("Song collection Started", "Song Collector");

  //Collection run in background and is relaunched every 30 sec
  try {
    await updatePaths();
    await updateAlbums();
    await updateArtists();

    await collect();
  } catch (err) {
    logger.error(new TaskException(__filename, "doWork", err));
  }
}
