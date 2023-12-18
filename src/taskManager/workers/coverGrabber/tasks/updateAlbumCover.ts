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

import { AlbumService } from "../../../../service/albumService";
import { CoverGrabberException } from "../../exceptions/coverGrabberException";
import { injectable } from "tsyringe"
import { imageFileData } from "../../../../access/api/DTO/ImageFileData";
import { Album } from "../../../../models/album";
import { ImageService } from "../../../../service/imageService";
import { Logger } from "../../../../utils/logger";
import { Image } from "../../../../models/image";

@injectable()
export class UpdateAlbumCoverTask {
    public doTask() {
        return this.albumService.getAlbumToCoverGrab()
            .then(async (data) => {
                for (let i = 0; i < data.length; i++) {
                    await this.albumService.fetchAlbumCover(data[i])
                        .then(data => this.resizeCover(data))
                        .then((img) => this.createCover(img, data[i]))
                        .catch((err) => {
                            throw new CoverGrabberException(__filename, "doTask", err);
                        })
                }
            })
            .catch(err => {
                throw new CoverGrabberException(__filename, "doTask", err)
            })
    }

    private async resizeCover(coverData: imageFileData): Promise<Image> {
        if (!coverData) { return }

        let resizes = await this.imageService.makeResizing(coverData);

        let tinyPath = await this.imageService.saveImageFileToDisk(resizes.tiny);
        if (resizes.small) {
            var smallPath = await this.imageService.saveImageFileToDisk(resizes.small);
        }
        if (resizes.medium) {
            var mediumPath = await this.imageService.saveImageFileToDisk(resizes.medium);
        }
        if (resizes.large) {
            var largePath = await this.imageService.saveImageFileToDisk(resizes.large);
        }
        if (resizes.verylarge) {
            var verylargePath = await this.imageService.saveImageFileToDisk(resizes.verylarge);
        }

        return {
            path: tinyPath,
            tiny: tinyPath,
            large: largePath,
            small: smallPath,
            medium: mediumPath,
            verylarge: verylargePath,
        }
    }

    private async createCover(cover: Image, album: Album) {
        let id = await this.imageService.createImage(cover);

        album.coverV2 = await this.imageService.getImage(id)
        album.lastCoverUpdate = Date.now();
        this.albumService.updateAlbum(album);
        this.logger.info(`Updated cover of album ${album.id}`, "Cover Grabber");
    }

    constructor(
        private albumService: AlbumService,
        private imageService: ImageService,
        private logger: Logger
    ) { }
}
