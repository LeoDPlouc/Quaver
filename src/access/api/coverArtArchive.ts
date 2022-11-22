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

import { APP_VERSION } from "../../config/appConfig";
import coverart from "coverart";
import { imageFileData } from "./DTO/ImageFileData";
import { CoverArtArchiveException } from "./exceptions/CovertArtArchiveException";

//DEPRECIATED Ne plus exporter lors du nettoyage des dépréciés, déplacer dans la class
export const caApi = new coverart({
  useragent: `Quaver/${APP_VERSION} (https://github.com/LeoDPlouc/Quaver)`,
});

class CoverArtArchiveAccess {
  public async getAlbumCover(mbid: string): Promise<imageFileData> {
    //Fetch Cover art
    let p = new Promise<any>((resolve, reject) => {
      caApi.release(mbid, { piece: "front", size: "large" }, (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });

    let { image, extension } = await p
      .catch(err => {
        throw new CoverArtArchiveException(__filename, "getAlbumCover", JSON.stringify(err))
      });

    if (!image) {
      return null;
    }
    return { data: image, extension };
  }
}

export const coverArtArchiveAccess = new CoverArtArchiveAccess();
