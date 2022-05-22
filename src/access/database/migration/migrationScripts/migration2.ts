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
import { getMBId } from "../../../api/musicbrainzApi";
import { deleteImage } from "../../../file/imageFile";
import { logInfo } from "../../../../utils/logger";
import { createFailure } from "../../../../utils/Failure";

export const migration2: IMigration = {
  //Remove single MB ID and fetch all fiting MB IDs
  async up(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw createFailure(err, __filename, migration2.up.name);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        logInfo(`Migration 2 -> 3 album ${a.id}`, "Migration");

        let mbids = await getMBId(a);
        if (!mbids) {
          continue;
        }

        a.mbids = mbids;
        a.mbid = undefined;

        try {
          await a.save();
        } catch (err) {
          throw createFailure(err, __filename, migration2.up.name);
        }
      }
    } catch (err) {
      throw createFailure(
        "Migration error",
        __filename,
        migration2.up.name,
        err
      );
    }
  },

  //Remove album covers
  async down(): Promise<void> {
    try {
      try {
        var albums = await albumModel.find();
      } catch (err) {
        throw createFailure(err, __filename, migration2.down.name);
      }

      for (let i = 0; i < albums.length; i++) {
        let a = albums[i];

        if (a.cover) {
          logInfo(`Migration 2 -> 1 album ${a.id}`, "Migration");

          try {
            var cover = await imageModel.findById(a.cover);
          } catch (err) {
            throw createFailure(err, __filename, migration2.down.name);
          }

          deleteImage(cover.path);
          cover.delete();

          a.cover = undefined;

          try {
            await a.save();
          } catch (err) {
            throw createFailure(err, __filename, migration2.down.name);
          }
        }
      }
    } catch (err) {
      throw createFailure(
        "Migration error",
        __filename,
        migration2.down.name,
        err
      );
    }
  },
};
