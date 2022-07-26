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

import path from "path";
import mm from "mime-types";
import { MUSIC_PATH } from "../../config/config";
import { createFailure } from "../../utils/Failure";
import { logError, logInfo } from "../../utils/logger";
import { albumService } from "../../service/albumService";
import { songService } from "../../service/songService";
import { artistService } from "../../service/artistService";
import { fileService } from "../../service/fileService";

let songPaths: string[];
let artists: Artist[];
let albums: Album[];

async function collect() {
  try {
    let paths = await fileService.getAllFiles(MUSIC_PATH);

    for (let i = 0; i < paths.length; i++) {
      //Only considere audio files
      if (!mm.lookup(path.extname(paths[i])).match("audio")) return;

      //If the song doesn't already exist, extract its metadata and create a new song
      if (songPaths.find((p) => p == paths[i])) return;

      let song = await songService.getMetadataFromFile(paths[i]);

      logInfo(`Found new song ${song.path}`, "Song Collector");

      //Fetch the song's album
      let album = findAlbumByName(song.album, song.artist);
      let albumId = album?.id;
      if (!album) {
        album = { artist: song.artist, title: song.album, year: song.year };

        albumId = await albumService.createAlbum(album);

        logInfo(`Found new album ${album.title}`, "Song Collector");

        await updateAlbums();
      }

      //Fetch the song's artist
      let artist = findArtistByName(song.artist);
      let artistId = artist?.id;
      if (!artist) {
        artist = { name: song.artist };

        artistId = await artistService.createArtist(artist);

        logInfo(`Found new artist ${artist.name}`, "Song Collector");

        await updateArtists();
      }

      album.artistId = artistId;
      await albumService.updateAlbum(album);

      song.artistId = artistId;
      song.albumId = albumId;
      await songService.createSong(song);
    }
  } catch (err) {
    throw createFailure("Song collection error", __filename, collect.name, err);
  }
}

async function updatePaths(): Promise<void> {
  songPaths = await songService.getAllSongPaths().catch((err) => {
    throw createFailure("Path update error", __filename, updatePaths.name, err);
  });
}

async function updateAlbums(): Promise<void> {
  albums = await albumService.getAllAlbums().catch((err) => {
    throw createFailure("Service error", __filename, updateAlbums.name, err);
  });
}

async function updateArtists(): Promise<void> {
  artists = await artistService.getAllArtists().catch((err) => {
    throw createFailure("Service error", __filename, updateArtists.name, err);
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
  logInfo("Song collection Started", "Song Collector");

  //Collection run in background and is relaunched every 30 sec
  try {
    await updatePaths();
    await updateAlbums();
    await updateArtists();

    await collect();
  } catch (err) {
    logError("Song collector error", __filename, doWork.name, err);
  }
}
