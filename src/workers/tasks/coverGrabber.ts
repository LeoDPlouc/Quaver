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
import { logger } from "../../utils/logger";
import { TaskException } from "./exceptions/taskException";

async function updateAlbumCover(album: Album) {
  try {
    let coverData = await albumService.getCover(album);
    if (!coverData) return;

    let resizes = await imageService.makeResizing(coverData);

    let tinyPath = await imageService.saveImageFile(resizes.tiny);
    if (resizes.small) {
      var smallPath = await imageService.saveImageFile(resizes.small);
    }
    if (resizes.medium) {
      var mediumPath = await imageService.saveImageFile(resizes.medium);
    }
    if (resizes.large) {
      var largePath = await imageService.saveImageFile(resizes.large);
    }
    if (resizes.verylarge) {
      var verylargePath = await imageService.saveImageFile(resizes.verylarge);
    }

    let id = await imageService.createImage({
      path: tinyPath,
      tiny: tinyPath,
      large: largePath,
      small: smallPath,
      medium: mediumPath,
      verylarge: verylargePath,
    });

    album.cover = id;
    album.lastCoverUpdate = Date.now();
    albumService.updateAlbum(album);
    logger.info(`Updated cover of album ${album.id}`, "Cover Grabber");
  } catch (err) {
    throw new TaskException(__filename, "updateAlbumCover", err);
  }
}

export default async function doWork() {
  logger.info("Cover grabber started", "Cover Grabber");
  let albums = await albumService.getToCoverGrabAlbums();

  for (let i = 0; i < albums.length; i++) {
    await updateAlbumCover(albums[i]).catch((err) => {
      logger.error(new TaskException(__filename, "doWork", err));
    });
  }
}
