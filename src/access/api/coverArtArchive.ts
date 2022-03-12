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
import coverart from "coverart"

interface imageFileData {
    data: string,
    extension: string
}

const caApi = new coverart({ useragent: `Quaver/${APP_VERSION} (https://github.com/LeoDPlouc/Quaver)` })

export async function getAlbumCover(mbids: string[]): Promise<imageFileData> {
    var cover
    var ext

    var i = 0
    //Try fetching cover art for every MB ID
    while (!cover && i < mbids.length) {
        try {
            //Fetch Cover art
            var p = new Promise<any>((resolve, reject) => {
                caApi.release(mbids[i], { piece: "front" }, (err, data) => {
                    if (err) reject(err)
                    resolve(data)
                })
            })
            var { image, extension } = await p
            cover = image
            ext = extension
        }
        catch { }
        finally { i++ }
    }

    return {
        data: cover,
        extension: ext
    }
}