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

import { createFailure } from "../../../../utils/Failure";
import { IMigration } from "../migration";
import { migration2 } from "./migration2";

export const migration4: IMigration = {
  async up(): Promise<void> {},

  //Remove MB ID list and keep only one
  async down(): Promise<void> {
    try {
      return migration2.down();
    } catch (err) {
      throw createFailure(
        "Migration error",
        __filename,
        migration4.down.name,
        err
      );
    }
  },
};
