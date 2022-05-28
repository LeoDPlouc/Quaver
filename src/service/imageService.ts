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

import { imageFileData } from "../access/api/coverArtArchive";
import {
  createImageModel,
  getAllImagesModels,
  getImageModel,
} from "../access/database/imageDAO";
import { mapImage } from "../mappers/imageMapper";
import { createFailure } from "../utils/Failure";
import { saveImage } from "../access/file/imageFile";

export async function getAllImages(): Promise<Image[]> {
  try {
    var result = await getAllImagesModels();
  } catch (err) {
    throw createFailure("DAO error", __filename, getAllImages.name, err);
  }

  return result.map((i) => mapImage(i));
}

export async function getImage(id: string): Promise<Image> {
  try {
    var result = await getImageModel(id);
  } catch (err) {
    throw createFailure("DAO error", __filename, getImage.name, err);
  }

  if (!result) {
    throw createFailure("Invalid Id", __filename, getImage.name);
  }

  return mapImage(result);
}

export async function saveImageFile(fileData: imageFileData): Promise<string> {
  if (!fileData) return;
  try {
    return await saveImage(fileData.data, fileData.extension);
  } catch (err) {
    throw createFailure(
      "File acces error",
      __filename,
      saveImageFile.name,
      err
    );
  }
}

export async function createImage(image: Image): Promise<string> {
  try {
    return await createImageModel(image);
  } catch (err) {
    throw createFailure("DAO error", __filename, createImage.name, err);
  }
}
