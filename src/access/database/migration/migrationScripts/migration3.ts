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

import { albumModel } from "../../models/albumModel";
import { IMigration } from "../migration";
import { getAlbumCoverLegacy2 } from "../legacy/legacyCode";
import { logger } from "../../../../utils/logger";
import { createFailure } from "../../../../utils/Failure";

export const migration3: IMigration = {
  //Download album covers
  async up(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw createFailure(err, __filename, migration3.up.name);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        if (!a.cover) {
          logger.info(`Migration 3 -> 4 album ${a.id}`, "Migration");

          let cover = await getAlbumCoverLegacy2(a);
          if (!cover) {
            continue;
          }

          await cover.save();

          a.cover = cover.id;
          await a.save();
        }
      }
    } catch (err) {
      throw createFailure(
        "Migration error",
        __filename,
        migration3.up.name,
        err
      );
    }
  },

  //Remove MB ID list and keep only one
  async down(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw createFailure(err, __filename, migration3.down.name);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        if (a.mbids) {
          logger.info(`Migration 3 -> 2 album ${a.id}`, "Migration");

          a.mbid = a.mbids[0];
          a.mbids = undefined;

          try {
            await a.save();
          } catch (err) {
            throw createFailure(err, __filename, migration3.down.name);
          }
        }
      }
    } catch (err) {
      throw createFailure(
        "Migration error",
        __filename,
        migration3.down.name,
        err
      );
    }
  },
};
