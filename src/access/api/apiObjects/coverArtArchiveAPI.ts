// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2023  DPlouc
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

import coverart from "coverart"
import { injectable } from "tsyringe"
import { APP_VERSION } from "../../../config/appConfig";

@injectable()
export class CoverArtArchiveAPI {
    private caObject = new coverart({
        useragent: `Quaver/${APP_VERSION} (https://github.com/LeoDPlouc/Quaver)`,
    });

    public release(mbid: string) {
        return new Promise<any>((resolve, reject) => {
            this.caObject.release(mbid, { piece: "front", size: "large" }, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        });
    }
}

