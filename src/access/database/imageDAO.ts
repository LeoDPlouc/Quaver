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
import { createFailure } from "../../utils/Failure";
import { imageModel } from "./models/imageModel";

class ImageDAO {
  public async getAllImagesModels(
    this: ImageDAO
  ): Promise<(Image & Document<any, any, Image>)[]> {
    try {
      return await imageModel.find();
    } catch (err) {
      throw createFailure(err, __filename, this.getAllImagesModels.name);
    }
  }

  public async getImageModel(
    this: ImageDAO,
    id: string
  ): Promise<Image & Document<any, any, Image>> {
    try {
      return await imageModel.findById(id);
    } catch (err) {
      createFailure(err, __filename, this.getImageModel.name);
    }
  }

  public async createImageModel(this: ImageDAO, image: Image): Promise<string> {
    try {
      return (await imageModel.create(image)).id;
    } catch (err) {
      throw createFailure(err, __filename, this.createImageModel.name);
    }
  }

  public async deleteImageModel(this: ImageDAO, id: string): Promise<void> {
    try {
      await imageModel.findByIdAndDelete(id);
    } catch (err) {
      throw createFailure(err, __filename, this.deleteImageModel.name);
    }
  }

  public async getTinyLessImageModel(
    this: ImageDAO
  ): Promise<(Image & Document<any, any, Image>)[]> {
    try {
      return await imageModel.find({ tiny: null });
    } catch (err) {
      throw createFailure(err, __filename, this.getTinyLessImageModel.name);
    }
  }
}

export const imageDAO = new ImageDAO();
