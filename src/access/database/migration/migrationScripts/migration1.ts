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
import { logger } from "../../../../utils/logger";
import { MigrationException } from "../exceptions/MigrationException";

export const migration1: IMigration = {
  //Download album covers
  async up(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw new MigrationException(__filename, "migration1.up", err);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        logger.info(`Migration 1 -> 2 album ${a.id}`, "Migration");

        let cover = await getAlbumCoverLegacy(a);
        if (!cover) {
          continue;
        }

        try {
          await cover.save();
        } catch (err) {
          throw new MigrationException(__filename, "migration1.up", err);
        }

        a.cover = cover.id;
        try {
          await a.save();
        } catch (err) {
          throw new MigrationException(__filename, "migration1.up", err);
        }
      }
    } catch (err) {
      throw new MigrationException(__filename, "migration1.up", err);
    }
  },

  //Remove MB IDs
  async down(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw new MigrationException(__filename, "migration1.down", err);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        if (!a.mbid) {
          logger.info(`Migration 1 -> 0 album ${a.id}`, "Migration");

          a.mbid = undefined;

          try {
            await a.save();
          } catch (err) {
            throw new MigrationException(__filename, "migration1.down", err);
          }
        }
      }
    } catch (err) {
      throw new MigrationException(__filename, "migration1.down", err);
    }
  },
};
