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

import Jimp from "jimp";
import { ServiceException } from "./exceptions/serviceException";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ImageProcessingException } from "./exceptions/imageProcessingException";
import { injectable, registry } from "tsyringe";
import { Image } from "../models/image";
import { imageFileData } from "./DTO/ImageFileData";
import { ImageDAO, ImageDAOToken } from "../DAO/interfaces/imageDAO.inter";
import { ImageService, ImageServiceToken } from "./interfaces/imageService.inter";
import { resizedImage } from "./DTO/resizedImage";
import { ImageFileService, ImageFileServiceToken } from "./interfaces/imageFileService.inter";
import { inject } from "vue";
import { ImageMapper, ImageMapperToken } from "../mappers/interfaces/imageMapper.inter";

@injectable()
@registry([{
  token: ImageServiceToken,
  useClass: ImageServiceImpl
}])
export class ImageServiceImpl implements ImageService {
  public async getAllImages(): Promise<Image[]> {
    return await this.imageDAO
      .getAllImagesModels()
      .then((result) => result.map(this.imageMapper.toImage))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllImages", err);
      });
  }

  public async getImage(id: string): Promise<Image> {
    let result = await this.imageDAO.getImageModel(id).catch((err) => {
      throw new ServiceException(__filename, "getImage", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getImage", "Image not found");
    }

    return this.imageMapper.toImage(result);
  }

  public async saveImageFileToDisk(fileData: imageFileData): Promise<string> {
    if (!fileData) {
      return;
    }

    return await this.imageFileAccess
      .saveImageFileToDisk(fileData.data, fileData.extension).catch((err) => {
        throw new ServiceException(__filename, "saveImageFileToDisk", err);
      });
  }

  public async createImage(image: Image): Promise<string> {
    return await this.imageDAO.createImageModel(image).catch((err) => {
      throw new ServiceException(__filename, "createImage", err);
    });
  }

  public async makeResizing(fileData: imageFileData): Promise<resizedImage> {
    let resizes: resizedImage = { tiny: null };

    let buffer = Buffer.from(fileData.data, "binary");
    let img = await Jimp.read(buffer);

    try {
      let height = img.getHeight();

      if (height >= 2560) {
        resizes.verylarge = {
          data: await this.resizeImage(img, 2560),
          extension: ".jpg",
        };
      }

      if (height >= 1080) {
        resizes.large = {
          data: await this.resizeImage(img, 1080),
          extension: ".jpg",
        };
      }

      if (height >= 540) {
        resizes.medium = {
          data: await this.resizeImage(img, 540),
          extension: ".jpg",
        };
      }

      if (height >= 220) {
        resizes.small = {
          data: await this.resizeImage(img, 220),
          extension: ".jpg",
        };
      }

      resizes.tiny = {
        data: await this.resizeImage(img, 110),
        extension: ".jpg",
      };

      return resizes;
    } catch (err) {
      throw new ServiceException(__filename, "makeResizing", err);
    }
  }

  public async deleteImageModel(id: string): Promise<void> {
    await this.imageDAO.deleteImageModel(id).catch((err) => {
      throw new ServiceException(__filename, "deleteImageModel", err);
    });
  }

  public async deleteImageFile(path: string): Promise<void> {
    await this.imageFileAccess
      .deleteImageFile(path).catch((err) => {
        throw new ServiceException(__filename, "deleteImageFile", err);
      });
  }

  public async deleteAllImageFiles(image: Image): Promise<void> {
    try {
      await this.imageFileAccess.deleteImageFile(image?.path);
      await this.imageFileAccess.deleteImageFile(image?.tiny);
      await this.imageFileAccess.deleteImageFile(image?.small);
      await this.imageFileAccess.deleteImageFile(image?.medium);
      await this.imageFileAccess.deleteImageFile(image?.large);
      await this.imageFileAccess.deleteImageFile(image?.verylarge);
    } catch (err) {
      throw new ServiceException(__filename, "deleteAllImageFiles", err);
    }
  }

  public async getTinyLessImage(): Promise<Image[]> {
    return await this.imageDAO
      .getTinyLessImageModel()
      .then((result) => result.map(this.imageMapper.toImage))
      .catch((err) => {
        throw new ServiceException(__filename, "getTinyLessImage", err);
      });
  }

  private async resizeImage(data: Jimp, size: number): Promise<string> {
    return await data
      .clone()
      .scaleToFit(size, size)
      .getBufferAsync(Jimp.MIME_JPEG)
      .then((result) => result.toString("binary"))
      .catch((err) => {
        throw new ImageProcessingException(__filename, "resizeImage", err);
      });
  }

  constructor(
    @inject(ImageDAOToken) private imageDAO: ImageDAO,
    @inject(ImageFileServiceToken) private imageFileAccess: ImageFileService,
    @inject(ImageMapperToken) private imageMapper: ImageMapper
  ) { }
}
