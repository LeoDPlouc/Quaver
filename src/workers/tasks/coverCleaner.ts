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
import { imageService } from "../../service/imageService";
import { createFailure } from "../../utils/Failure";
import { logError, logInfo } from "../../utils/logger";

async function cleanAlbumlessImages() {
  try {
    var images = await imageService.getAllImages();
    var albums = await albumService.getAllAlbums();
  } catch (err) {
    throw createFailure(
      "DAO error",
      __filename,
      cleanAlbumlessImages.name,
      err
    );
  }

  for (let i = 0; i < images.length; i++) {
    if (!albums.find((a) => a.cover == images[i].id)) {
      try {
        await imageService.deleteImageModel(images[i].id);
        logInfo(`Deleted image ${images[i].id}`, "Cover Cleaner");
      } catch (err) {
        logError(
          createFailure("DAO error", __filename, cleanAlbumlessImages.name, err)
        );
      }
    }
  }
}

async function cleanTinylessImages() {
  try {
    var images = await imageService.getTinyLessImage();
  } catch (err) {
    throw createFailure("DAO err", __filename, cleanTinylessImages.name, err);
  }

  for (let i = 0; i < images.length; i++) {
    try {
      await imageService.deleteImageModel(images[i].id);
    } catch (err) {
      logError(
        createFailure("DAO error", __filename, cleanTinylessImages.name, err)
      );
    }
  }
}

export default async function doWork() {
  logInfo("Cover cleaner started", "Cover Cleaner");

  try {
    await cleanAlbumlessImages();
    await cleanTinylessImages();
  } catch (err) {
    logError(
      createFailure("Cover cleaner error", __filename, doWork.name, err)
    );
  }
}
