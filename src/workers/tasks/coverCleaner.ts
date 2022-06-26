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

import { getAllAlbums } from "../../service/albumService";
import {
  deleteImage,
  getAllImages,
  getTinyLessImage,
} from "../../service/imageService";
import { logError, logInfo } from "../../utils/logger";

let images: Image[] = [];
let albums: Album[] = [];

async function cleanAlbumlessImages() {
  for (let i = 0; i < images.length; i++) {
    if (!albums.find((a) => a.cover == images[i].id)) {
      try {
        await await deleteImage(images[i].id);
        logInfo(`Deleted image ${images[i].id}`, "Cover Cleaner");
      } catch (err) {
        logError(err);
      }
    }
  }
}

async function cleanTinylessImages() {
  for (let i = 0; i < images.length; i++) {}
}

export default async function doWork() {
  logInfo("Cover cleaner started", "Cover Cleaner");

  images = await getAllImages();
  albums = await getAllAlbums();

  await cleanAlbumlessImages();

  images = await getTinyLessImage();
  albums = await getAllAlbums();
}
