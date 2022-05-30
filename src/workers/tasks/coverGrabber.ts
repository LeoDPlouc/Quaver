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
import {
  createImage,
  makeResizing,
  saveImageFile,
} from "../../service/imageService";
import { createFailure } from "../../utils/Failure";
import { logError, logInfo } from "../../utils/logger";

async function updateAlbumCover(album: Album) {
  try {
    let coverData = await getCover(album);
    if (!coverData) return;

    let resizes = await makeResizing(coverData);

    let tinyPath = await saveImageFile(resizes.tiny);
    if (resizes.small) var smallPath = await saveImageFile(resizes.small);
    if (resizes.medium) var mediumPath = await saveImageFile(resizes.medium);
    if (resizes.large) var largePath = await saveImageFile(resizes.large);
    if (resizes.verylarge)
      var verylargePath = await saveImageFile(resizes.verylarge);

    let id = await createImage({
      path: tinyPath,
      large: largePath,
      small: smallPath,
      medium: mediumPath,
      verylarge: verylargePath,
    });

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
