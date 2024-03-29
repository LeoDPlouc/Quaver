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
import { albumModel } from "../../models/albumModel";
import { imageModel } from "../../models/imageModel";
import { logger } from "../../../../utils/logger";
import { musicBrainzApiAccess } from "../../../api/musicbrainzApi";
import { imageFileAccess } from "../../../file/imageFile";
import { MigrationException } from "../exceptions/MigrationException";

export const migration2: IMigration = {
  //Remove single MB ID and fetch all fiting MB IDs
  async up(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw new MigrationException(__filename, "migration2.up", err);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        logger.info(`Migration 2 -> 3 album ${a.id}`, "Migration");

        let mbids = await musicBrainzApiAccess.getMBId(a);
        if (!mbids) {
          continue;
        }

        a.mbids = mbids;
        a.mbid = undefined;

        try {
          await a.save();
        } catch (err) {
          throw new MigrationException(__filename, "migration2.up", err);
        }
      }
    } catch (err) {
      throw new MigrationException(__filename, "migration2.up", err);
    }
  },

  //Remove album covers
  async down(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw new MigrationException(__filename, "migration2.down", err);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        if (a.cover) {
          logger.info(`Migration 2 -> 1 album ${a.id}`, "Migration");

          try {
            var cover = await imageModel.findById(a.cover);
          } catch (err) {
            throw new MigrationException(__filename, "migration2.down", err);
          }

          imageFileAccess.deleteImageFile(cover.path);
          cover.delete();

          a.cover = undefined;

          try {
            await a.save();
          } catch (err) {
            throw new MigrationException(__filename, "migration2.down", err);
          }
        }
      }
    } catch (err) {
      throw new MigrationException(__filename, "migration2.down", err);
    }
  },
};
