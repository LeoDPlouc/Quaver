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

import { Album } from "../../../../models/album";
import { Image } from "../../../../models/image";
import { AlbumService } from "../../../../service/albumService";
import { ImageService } from "../../../../service/imageService";
import { Logger } from "../../../../utils/logger";
import { CoverCleanerException } from "../../exceptions/coverCleanerException";
import { injectable } from "tsyringe"

@injectable()
export class CleanAlbumCoverIdTask {
  public async doTask() {
    return this.fetchData()
      .then(async (data) => {
        for (let i = 0; i < data.albums.length; i++) {
          if (data.albums[i].coverV2 && !data.images.find(img => this.isImageThisAlbumCover(img, data.albums[i]))) {
            await this.cleanAlbumCoverId(data.albums[i])
          }
        }
      })
      .catch(err => {
        throw new CoverCleanerException(__filename, "doTask", err);
      })
  }

  private async fetchData() {
    const images = await this.imageService.getAllImages();
    const albums = await this.albumService.getAllAlbums();

    return { images, albums }
  }

  private async cleanAlbumCoverId(album: Album) {
    try {
      album.coverV2 = null;
      await this.albumService.updateAlbum(album);
      this.logger.info(`Clean cover id for ${album.id}`, "Cover Cleaner");
    } catch (err) {
      this.logger.error(new CoverCleanerException(__filename, "cleanAlbumCoverId", err));
    }
  }

  private isImageThisAlbumCover(image: Image, album: Album): boolean {
    return String(image.id) == String(album.coverV2.id)
  }


  constructor(
    private albumService: AlbumService,
    private imageService: ImageService,
    private logger: Logger
  ) { }
}