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

import { imageFileData } from "./DTO/ImageFileData";
import { CoverArtArchiveException } from "./exceptions/CovertArtArchiveException";
import { CoverArtNotFoundException } from "./exceptions/CoverArtNotFoundException";
import { CoverArtArchiveAPI } from "./apiObjects/coverArtArchiveAPI";
import { injectable } from "tsyringe";

@injectable()
export class CoverArtArchiveAccess {
  public async fetchAlbumCover(mbid: string): Promise<imageFileData> {
    //Fetch Cover art
    let { image, extension } = await this.coverArtArchiveAPI.release(mbid)
      .catch(err => {
        this.handleException(err, "fetchAlbumCover")
      });

    if (!image) {
      return null;
    }
    return { data: image, extension };
  }


  private handleException(err: any, funcName: string): void {
    let strErr = JSON.stringify(err)

    if (strErr.match(/404/).length) {
      throw new CoverArtNotFoundException(__filename, funcName, strErr)
    } else {
      throw new CoverArtArchiveException(__filename, funcName, JSON.stringify(err))
    }
  }

  constructor(private coverArtArchiveAPI: CoverArtArchiveAPI) { }
}
