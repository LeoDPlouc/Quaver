// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2023  DPlouc
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

import { albumService } from "../../../../service/albumService";
import { imageService } from "../../../../service/imageService";
import { logger } from "../../../../utils/logger";
import { CoverCleanerException } from "../../exceptions/coverCleanerException";
import { TaskException } from "../../exceptions/taskException";

export async function cleanAlbumCoverId() {
    try {
      var images = await imageService.getAllImages();
      var albums = await albumService.getAllAlbums();
    } catch (err) {
      throw new CoverCleanerException(__filename, "cleanAlbumCoverId", err);
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
      logger.error(new CoverCleanerException(__filename, "cleanAlbumCoverId", err));
    }
  }