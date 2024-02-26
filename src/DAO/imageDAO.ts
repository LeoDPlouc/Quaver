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

import { Document } from "mongoose";
import { DAOException } from "./exceptions/DAOException";
import { injectable, registry } from "tsyringe";
import { ImageModel } from "./models/imageModel";
import { ImageDAO, ImageDAOToken } from "./interfaces/imageDAO.inter";
import { Image } from "../models/image";

export type ImageDocument = Image & Document<any, any, Image>;

@injectable()
@registry([{
  token: ImageDAOToken,
  useClass: ImageDAOImpl
}])
export class ImageDAOImpl implements ImageDAO {
  public async getAllImagesModels(): Promise<ImageDocument[]> {
    try {
      return await this.imageModel.find()
    } catch (err) {
      throw new DAOException(__filename, "getAllImagesModels", err);
    }
  }

  public async getImageModel(id: string): Promise<ImageDocument> {
    try {
      return await this.imageModel.findById(id)
    } catch (err) {
      throw new DAOException(__filename, "getImageModel", err);
    }
  }

  public async createImageModel(image: Image): Promise<string> {
    try {
      return await this.imageModel.create(image)
        .then((i) => i.id)
    } catch (err) {
      throw new DAOException(__filename, "createImageModel", err);
    }
  }

  public async deleteImageModel(id: string): Promise<void> {
    try {
      await this.imageModel.findByIdAndDelete(id)
    } catch (err) {
      throw new DAOException(__filename, "deleteImageModel", err);
    }
  }

  public async getTinyLessImageModel(): Promise<ImageDocument[]> {
    try {
      return await this.imageModel.find({ tiny: null })
    } catch (err) {
      throw new DAOException(__filename, "getTinyLessImageModel", err);
    }
  }

  constructor(private imageModel: ImageModel) { }
}
