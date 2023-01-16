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
import { fileService } from "../../service/fileService";
import { imageService } from "../../service/imageService";
import { logger } from "../../utils/logger";
import { TaskException } from "./exceptions/taskException";

async function cleanImagesWithoutAlbum() {
  try {
    var images = await imageService.getAllImages();
    var albums = await albumService.getAllAlbums();
  } catch (err) {
    throw new TaskException(__filename, "cleanImagesWithoutAlbum", err);
  }

  for (let i = 0; i < images.length; i++) {
    if (!albums.find((a) => String(a.coverV2?.id) == String(images[i].id))) {
      try {
        await imageService.deleteImageModel(images[i].id);
        logger.info(`Deleted image ${images[i].id}`, "Cover Cleaner");
      } catch (err) {
        logger.error(new TaskException(__filename, "cleanImagesWithoutAlbum", err));
      }
    }
  }
}

async function cleanImageWithoutTinyFile() {
  try {
    var images = await imageService.getAllImages();
    var files = await fileService.getAllFiles(fileService.getImagesPath());
  } catch (err) {
    logger.error(new TaskException(__filename, "cleanImageWithoutTinyFile", err));
  }

  for (let i = 0; i < images.length; i++) {
    if (!files.find((f) => f == images[i].tiny)) {
      try {
        imageService.deleteImageModel(images[i].id);
        logger.info(`Deleted cover ${files[i]}`, "Cover Cleaner");
      } catch (err) {
        logger.error(new TaskException(__filename, "cleanImageWithoutTinyFile", err));
      }
    }
  }
}

async function cleanImagesWthoutTinyField() {
  var images = await imageService.getTinyLessImage()
    .catch((err) => {
      throw new TaskException(__filename, "cleanImagesWthoutTinyField", err);
    });

  for (let i = 0; i < images.length; i++) {
    await imageService.deleteImageModel(images[i].id)
      .catch((err) => {
        logger.error(new TaskException(__filename, "cleanImagesWthoutTinyField", err));
      });
  }
}

async function cleanFilesWithoutImage() {
  try {
    var coverFiles = await imageService
      .getAllImages()
      .then((result) => result.map((i) => [i.large, i.medium, i.path, i.small, i.tiny, i.verylarge]))
      .then((result) => result.reduce((tab1, tab2) => [...tab1, ...tab2], []))
      .then((result) => result.filter((p) => p));
    var files = await fileService.getAllFiles(fileService.getImagesPath());
  } catch (err) {
    logger.error(new TaskException(__filename, "cleanFilesWithoutImage", err));
  }

  for (let i = 0; i < files.length; i++) {
    if (!coverFiles.find((p) => p == files[i])) {
      try {
        await imageService.deleteImageFile(files[i]);
        logger.info(`Deleted cover ${files[i]}`, "Cover Cleaner");
      } catch (err) {
        logger.error(new TaskException(__filename, "cleanFilesWithoutImage", err));
      }
    }
  }
}

async function cleanAlbumCoverId() {
  try {
    var images = await imageService.getAllImages();
    var albums = await albumService.getAllAlbums();
  } catch (err) {
    throw new TaskException(__filename, "cleanAlbumCoverId", err);
  }

  try {
    for (let i = 0; i < albums.length; i++) {
      if (albums[i].coverV2 && !images.find((im) => String(im.id) == String(albums[i].coverV2.id))) {
        albums[i].coverV2 = null;
        await albumService.updateAlbum(albums[i]);
        logger.info(`Clean cover id for ${albums[i].id}`, "Cover Cleaner");
      }
    }
  } catch (err) {
    logger.error(new TaskException(__filename, "cleanAlbumCoverId", err));
  }
}

async function cleanImagesWithDeadFiles() {
  try {
    var images = await imageService.getAllImages();
    var files = await fileService.getAllFiles(fileService.getImagesPath());
  } catch (err) {
    throw new TaskException(__filename, "cleanImagesWithDeadFiles", err);
  }

  try {
    for (let i = 0; i < images.length; i++) {
      let isDead = ![images[i].large, images[i].medium, images[i].small, images[i].verylarge]
        .filter((i) => !!i)
        .map((i) => !!files.find((f) => f == i))
        .reduce((prev, cur) => prev && cur, true);

      if (isDead) {
        imageService.deleteImageModel(images[i].id);
        logger.info(`Deleted image ${images[i].id}`, "Cover Cleaner");
      }
    }
  } catch (err) {
    logger.error(new TaskException(__filename, "cleanImagesWithDeadFiles", err));
  }
}

export default async function doWork() {
  logger.info("Cover cleaner started", "Cover Cleaner");

  try {
    await cleanImagesWithoutAlbum();
    await cleanImageWithoutTinyFile();
    await cleanImagesWithDeadFiles();
    await cleanImagesWthoutTinyField();
    await cleanFilesWithoutImage();
    await cleanAlbumCoverId();
  } catch (err) {
    logger.error(new TaskException(__filename, "doWork", err));
  }
}
