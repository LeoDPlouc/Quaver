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
  getCover,
  getCoverlessAlbums,
  updateAlbum,
} from "../../service/albumService";
import { createImage, saveImageFile } from "../../service/imageService";
import { createFailure } from "../../utils/Failure";
import { logError, logInfo } from "../../utils/logger";

async function updateAlbumCover(album: Album) {
  try {
    let coverData = await getCover(album);
    if (!coverData) return;

    let path = await saveImageFile(coverData);
    let id = await createImage({ path });

    album.cover = id;
    updateAlbum(album);
    logInfo(`Found new cover for album ${album.id}`, "Cover Grabber");
  } catch (err) {
    throw createFailure("Task failure", __filename, updateAlbumCover.name, err);
  }
}

export default async function doWork() {
  logInfo("Cover grabber startded", "Cover Grabber");
  let albums = await getCoverlessAlbums();

  for (let i = 0; i < albums.length; i++) {
    try {
      await updateAlbumCover(albums[i]);
    } catch (err) {
      logError(err);
    }
  }
}
