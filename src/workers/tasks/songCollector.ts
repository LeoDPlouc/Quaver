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

import fs from "fs/promises";
import path from "path";
import mm from "mime-types";
import { MUSIC_PATH } from "../../config/config";
import { createSong, getAllSongPaths } from "../../service/songService";
import { getMetadataFromFile } from "../../access/file/songFile";
import {
  createAlbum,
  getAllAlbums,
  updateAlbum,
} from "../../service/albumService";
import { createArtist, getAllArtists } from "../../service/artistService";
import { createFailure } from "../../utils/Failure";
import { logError, logInfo } from "../../utils/logger";

let songPaths: string[];
let artists: Artist[];
let albums: Album[];

async function collect(libPath: string) {
  try {
    var paths = await fs.readdir(libPath, { withFileTypes: true });
  } catch (err) {
    throw createFailure(err, __filename, collect.name);
  }

  for (var i = 0; i < paths.length; i++) {
    var fullPath = path.join(libPath, paths[i].name);

    if (paths[i].isDirectory()) {
      try {
        await collect(fullPath);
      } catch (err) {
        logError(err);
        continue;
      }
    }

    if (paths[i].isFile())
      await registerSong(path.resolve(fullPath)).catch(() => {});
  }
}

async function registerSong(songPath: string) {
  try {
    //Only considere audio files
    if (!mm.lookup(path.extname(songPath)).match("audio")) return;

    //If the song doesn't already exist, extract its metadata and create a new song
    if (songPaths.find((p) => p == songPath)) return;

    let song = await getMetadataFromFile(songPath);

    logInfo(`Found new song ${song.path}`, "Song Collector");

    //Fetch the song's album
    let album = findAlbumByName(song.album, song.artist);
    let albumId = album?.id;
    if (!album) {
      album = { artist: song.artist, title: song.album, year: song.year };

      albumId = await createAlbum(album);

      logInfo(`Found new album ${album.title}`, "Song Collector");

      await updateAlbums();
    }

    //Fetch the song's artist
    let artist = findArtistByName(song.artist);
    let artistId = artist?.id;
    if (!artist) {
      artist = { name: song.artist };

      artistId = await createArtist(artist);

      logInfo(`Found new artist ${artist.name}`, "Song Collector");

      await updateArtists();
    }

    album.artistId = artistId;
    await updateAlbum(album);

    song.artistId = artistId;
    song.albumId = albumId;
    await createSong(song);
  } catch (err) {
    throw createFailure(
      "Song collection error",
      __filename,
      registerSong.name,
      err
    );
  }
}

async function updatePaths(): Promise<void> {
  try {
    songPaths = await getAllSongPaths();
  } catch (err) {
    throw createFailure("Path update error", __filename, updatePaths.name, err);
  }
}

async function updateAlbums(): Promise<void> {
  try {
    albums = await getAllAlbums();
  } catch (err) {
    throw createFailure("Service error", __filename, updateAlbums.name, err);
  }
}

async function updateArtists(): Promise<void> {
  try {
    artists = await getAllArtists();
  } catch (err) {
    throw createFailure("Service error", __filename, updateArtists.name, err);
  }
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

    await collect(MUSIC_PATH);
  } catch (err) {
    logError(err);
  }
}
