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
import { TaskException } from "../../exceptions/taskException";

export async function updateAlbumCover() {
    let albums = await albumService.getAlbumToCoverGrab();

    for (let i = 0; i < albums.length; i++) {
        try {
            let coverData = await albumService.fetchAlbumCover(albums[i]);
            if (!coverData) return;

            let resizes = await imageService.makeResizing(coverData);

            let tinyPath = await imageService.saveImageFileToDisk(resizes.tiny);
            if (resizes.small) {
                var smallPath = await imageService.saveImageFileToDisk(resizes.small);
            }
            if (resizes.medium) {
                var mediumPath = await imageService.saveImageFileToDisk(resizes.medium);
            }
            if (resizes.large) {
                var largePath = await imageService.saveImageFileToDisk(resizes.large);
            }
            if (resizes.verylarge) {
                var verylargePath = await imageService.saveImageFileToDisk(resizes.verylarge);
            }

            let id = await imageService.createImage({
                path: tinyPath,
                tiny: tinyPath,
                large: largePath,
                small: smallPath,
                medium: mediumPath,
                verylarge: verylargePath,
            });

            albums[i].coverV2 = await imageService.getImage(id)
            albums[i].lastCoverUpdate = Date.now();
            albumService.updateAlbum(albums[i]);
            logger.info(`Updated cover of album ${albums[i].id}`, "Cover Grabber");
        } catch (err) {
            throw new TaskException(__filename, "updateAlbumCover", err);
        }
    }
}