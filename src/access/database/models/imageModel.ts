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

import { FilterQuery, Schema, model } from "mongoose";
import { injectable } from "tsyringe";
import { Image } from "../../../models/image";

const imageSchema = new Schema<Image>({
  //DEPRECIATED
  path: {
    type: String,
    require: [true, "Image must have a path"],
  },

  //DEPRECIATED : add require
  tiny: {
    type: String,
  },
  small: {
    type: String,
  },
  medium: {
    type: String,
  },
  large: {
    type: String,
  },
  verylarge: {
    type: String,
  },
});


const imageModel = model<Image>("Image", imageSchema)

@injectable()
export class ImageModel {

  public get model() { return imageModel }

  public find(query?: FilterQuery<Image>) {
    return imageModel.find(query || {})
  }

  public findById(id: string) {
    return imageModel.findById(id)
  }

  public create(album: Image) {
    return imageModel.create(album)
  }

  public findByIdAndUpdate(id: string, album: Image) {
    return imageModel.findByIdAndUpdate(id, album)
  }

  public deleteMany(query?: FilterQuery<Image>) {
    return imageModel.deleteMany(query || {})
  }

  public findByIdAndDelete(id: string) {
    return imageModel.findByIdAndDelete(id)
  }
}

