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

import { ImageMapper } from "../mappers/imageMapper";
import Jimp from "jimp";
import { imageFileData } from "../access/api/DTO/ImageFileData";
import { ServiceException } from "./exceptions/serviceException";
import { NotFoundException } from "../utils/exceptions/notFoundException";
import { ImageProcessingException } from "./exceptions/imageProcessingException";
import { ImageDAO } from "../access/database/imageDAO";
import { injectable } from "tsyringe";
import { ImageFileAccess } from "../access/file/imageFile";
import { Image } from "../models/image";

export interface resizedImage {
  tiny: imageFileData;
  small?: imageFileData;
  medium?: imageFileData;
  large?: imageFileData;
  verylarge?: imageFileData;
}

@injectable()
export class ImageService {
  public async getAllImages(this: ImageService): Promise<Image[]> {
    return await this.imageDAO
      .getAllImagesModels()
      .then((result) => result.map(this.imageMapper.toImage))
      .catch((err) => {
        throw new ServiceException(__filename, "getAllImages", err);
      });
  }

  public async getImage(this: ImageService, id: string): Promise<Image> {
    let result = await this.imageDAO.getImageModel(id).catch((err) => {
      throw new ServiceException(__filename, "getImage", err);
    });

    if (!result) {
      throw new NotFoundException(__filename, "getImage", "Image not found");
    }

    return this.imageMapper.toImage(result);
  }

  public async saveImageFileToDisk(this: ImageService, fileData: imageFileData): Promise<string> {
    if (!fileData) {
      return;
    }

    return await this.imageFileAccess
      .saveImageFileToDisk(fileData.data, fileData.extension).catch((err) => {
        throw new ServiceException(__filename, "saveImageFileToDisk", err);
      });
  }

  public async createImage(this: ImageService, image: Image): Promise<string> {
    return await this.imageDAO.createImageModel(image).catch((err) => {
      throw new ServiceException(__filename, "createImage", err);
    });
  }

  public async makeResizing(this: ImageService, fileData: imageFileData): Promise<resizedImage> {
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

  public async deleteImageModel(this: ImageService, id: string): Promise<void> {
    await this.imageDAO.deleteImageModel(id).catch((err) => {
      throw new ServiceException(__filename, "deleteImageModel", err);
    });
  }

  public async deleteImageFile(this: ImageService, path: string): Promise<void> {
    await this.imageFileAccess
      .deleteImageFile(path).catch((err) => {
        throw new ServiceException(__filename, "deleteImageFile", err);
      });
  }

  public async deleteAllImageFiles(this: ImageService, image: Image): Promise<void> {
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

  public async getTinyLessImage(this: ImageService): Promise<Image[]> {
    return await this.imageDAO
      .getTinyLessImageModel()
      .then((result) => result.map(this.imageMapper.toImage))
      .catch((err) => {
        throw new ServiceException(__filename, "getTinyLessImage", err);
      });
  }

  private async resizeImage(this: ImageService, data: Jimp, size: number): Promise<string> {
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
    private imageDAO: ImageDAO,
    private imageFileAccess: ImageFileAccess,
    private imageMapper: ImageMapper
  ) { }
}
