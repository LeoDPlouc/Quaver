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

import { getAllImagesModels, getImageModel } from "../access/database/imageDAO";
import { mapImage } from "../mappers/imageMapper";
import { createFailure, Failable } from "../utils/Failable";

export async function getAllImages(): Promise<Failable<Image[]>> {
  let result = await getAllImagesModels();

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getAllImages.name,
        result.failure
      ),
    };
  }

  return { result: result.result.map((i) => mapImage(i)) };
}

export async function getImage(id: string): Promise<Failable<Image>> {
  let result = await getImageModel(id);

  if (result.failure) {
    return {
      failure: createFailure(
        "DAO error",
        __filename,
        getImage.name,
        result.failure
      ),
    };
  }

  if (!result.result) {
    return {
      failure: createFailure("Invalid Id", __filename, getImage.name),
    };
  }

  return { result: mapImage(result.result) };
}
