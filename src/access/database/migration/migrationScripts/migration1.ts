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

import { IMigration } from "../migration";
import { getAlbumCoverLegacy } from "../legacy/legacyCode";
import { albumModel } from "../../models/albumModel";
import { createFailure } from "../../../../utils/Failure";
import { logError, logInfo } from "../../../../utils/logger";

export const migration1: IMigration = {
  //Download album covers
  async up(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw createFailure(err, __filename, migration1.up.name);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        logInfo(`Migration 1 -> 2 album ${a.id}`);

        let cover = await getAlbumCoverLegacy(a);
        if (!cover) {
          continue;
        }

        try {
          await cover.save();
        } catch (err) {
          throw createFailure(err, __filename, migration1.up.name);
        }

        a.cover = cover.id;
        try {
          await a.save();
        } catch (err) {
          throw createFailure(err, __filename, migration1.up.name);
        }
      }
    } catch (err) {
      throw createFailure(err, __filename, migration1.up.name);
    }
  },

  //Remove MB IDs
  async down(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw createFailure(err, __filename, migration1.down.name);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        if (!a.mbid) {
          logInfo(`Migration 1 -> 0 album ${a.id}`);

          a.mbid = undefined;

          try {
            await a.save();
          } catch (err) {
            throw createFailure(err, __filename, migration1.down.name);
          }
        }
      }
    } catch (err) {
      throw createFailure(err, __filename, migration1.down.name);
    }
  },
};
