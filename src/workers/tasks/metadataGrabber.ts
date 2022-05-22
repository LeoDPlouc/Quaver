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

import {
  getAlbumMbid,
  getAlbumMetadata,
  getAllAlbums,
  getMbidlessAlbum,
  updateAlbum,
} from "../../service/albumService";
import { createFailure } from "../../utils/Failure";
import { logError, logInfo } from "../../utils/logger";

async function grabMbids() {
  let albums = await getMbidlessAlbum();

  for (let i = 0; i < albums.length; i++) {
    try {
      let mbids = await getAlbumMbid(albums[i]);
      if (!mbids.length) return;

      albums[i].mbids = mbids;
      await updateAlbum(albums[i]);

      logInfo(`Found Mbids for ${albums[i].id}`, "Metadata Grabber");
    } catch (err) {
      logError(createFailure("Task error", __filename, grabMbids.name, err));
    }
  }
}

async function updateMetadata() {
  let albums = await getAllAlbums();

  for (let i = 0; i < albums.length; i++) {
    try {
      let metadata = await getAlbumMetadata(albums[i]);

      if (metadata.title) albums[i].title = metadata.title;
      if (metadata.artist) albums[i].artist = metadata.artist;
      if (metadata.year) albums[i].year = metadata.year;

      await updateAlbum(albums[i]);
      logInfo(`Updated metadata for ${albums[i].id}`, "Metadata Grabber");
    } catch (err) {
      logError(
        createFailure("Task error", __filename, updateMetadata.name, err)
      );
    }
  }
}

export default async function doWork() {
  logInfo("Metadata grabber started", "Metadata Grabber");
  await grabMbids();
  await updateMetadata();
}
