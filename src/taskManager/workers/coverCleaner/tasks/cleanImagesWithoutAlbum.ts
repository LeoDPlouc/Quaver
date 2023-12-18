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

import { CoverCleanerException } from "../../exceptions/coverCleanerException";
import { injectable } from "tsyringe"
import { AlbumService } from "../../../../service/albumService";
import { Album } from "../../../../models/album";
import { ImageService } from "../../../../service/imageService";
import { Logger } from "../../../../utils/logger";
import { Image } from "../../../../models/image";

@injectable()
export class CleanImagesWithoutAlbumTask {
  public async doTask(this: CleanImagesWithoutAlbumTask) {
    return this.fetchData()
      .then(async (data) => {
        for (let i = 0; i < data.images.length; i++) {
          if (!data.albums.find((a) => this.hasAlbumThisCover(a, data.images[i]))) {
            await this.deleteImageModel(data.images[i])
          }
        }
      })
      .catch(err => { throw new CoverCleanerException(__filename, "doTask", err) })
  }

  private async fetchData(this: CleanImagesWithoutAlbumTask) {
    const images = await this.imageService.getAllImages();
    const albums = await this.albumService.getAllAlbums();

    return { images, albums }
  }

  private async deleteImageModel(image: Image) {
    try {
      await this.imageService.deleteImageModel(image.id);
      this.logger.info(`Deleted image ${image.id}`, "Cover Cleaner");
    } catch (err) {
      this.logger.error(new CoverCleanerException(__filename, "deleteImageModel", err));
    }
  }

  private hasAlbumThisCover(album: Album, cover: Image) {
    return String(album.coverV2?.id) == String(cover.id)
  }

  constructor(
    private albumService: AlbumService,
    private imageService: ImageService,
    private logger: Logger
  ) { }
}