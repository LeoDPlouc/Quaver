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

import { mapImage } from "../mappers/imageMapper";
import { createFailure } from "../utils/Failure";
import Jimp from "jimp";
import { imageDAO } from "../access/database/imageDAO";
import { imageFileAccess } from "../access/file/imageFile";
import { imageFileData } from "../access/api/DTO/ImageFileData";

export interface resizedImage {
  tiny: imageFileData;
  small?: imageFileData;
  medium?: imageFileData;
  large?: imageFileData;
  verylarge?: imageFileData;
}

class ImageService {
  public async getAllImages(this: ImageService): Promise<Image[]> {
    return await imageDAO
      .getAllImagesModels()
      .then((result) => result.map(mapImage))
      .catch((err) => {
        throw createFailure("DAO error", __filename, "getAllImages", err);
      });
  }

  public async getImage(this: ImageService, id: string): Promise<Image> {
    let result = await imageDAO.getImageModel(id).catch((err) => {
      throw createFailure("DAO error", __filename, "getImage", err);
    });

    if (!result) {
      throw createFailure("Invalid Id", __filename, "getImage");
    }

    return mapImage(result);
  }

  public async saveImageFile(this: ImageService, fileData: imageFileData): Promise<string> {
    if (!fileData) {
      return;
    }

    return await imageFileAccess.saveImage(fileData.data, fileData.extension).catch((err) => {
      throw createFailure("File acces error", __filename, "saveImageFile", err);
    });
  }

  public async createImage(this: ImageService, image: Image): Promise<string> {
    return await imageDAO.createImageModel(image).catch((err) => {
      throw createFailure("DAO error", __filename, "createImage", err);
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
      throw createFailure("Resize error", __filename, "makeResizing", err);
    }
  }

  public async deleteImageModel(this: ImageService, id: string): Promise<void> {
    await imageDAO.deleteImageModel(id).catch((err) => {
      throw createFailure("DAO error", __filename, "deleteImageModel", err);
    });
  }

  public async deleteImageFile(this: ImageService, path: string): Promise<void> {
    await imageFileAccess.deleteImageFile(path).catch((err) => {
      throw createFailure("File access error", __filename, "deleteImageFile", err);
    });
  }

  public async deleteAllImageFiles(this: ImageService, image: Image): Promise<void> {
    try {
      await imageFileAccess.deleteImageFile(image?.path);
      await imageFileAccess.deleteImageFile(image?.tiny);
      await imageFileAccess.deleteImageFile(image?.small);
      await imageFileAccess.deleteImageFile(image?.medium);
      await imageFileAccess.deleteImageFile(image?.large);
      await imageFileAccess.deleteImageFile(image?.verylarge);
    } catch (err) {
      throw createFailure("File access error", __filename, "deleteAllImageFiles", err);
    }
  }

  public async getTinyLessImage(this: ImageService): Promise<Image[]> {
    return await imageDAO
      .getTinyLessImageModel()
      .then((result) => result.map(mapImage))
      .catch((err) => {
        throw createFailure("DAO error", __filename, "getTinyLessImage", err);
      });
  }

  private async resizeImage(this: ImageService, data: Jimp, size: number): Promise<string> {
    return await data
      .clone()
      .scaleToFit(size, size)
      .getBufferAsync(Jimp.MIME_JPEG)
      .then((result) => result.toString("binary"))
      .catch((err) => {
        throw createFailure(err, __filename, "resizeImage");
      });
  }
}

export const imageService = new ImageService();
