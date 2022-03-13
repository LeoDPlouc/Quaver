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

import { cleanDatabase, createDatabase, getOneAlbum } from "../util"
import { migration4 } from "../../src/access/database/migration/migrationScripts/migration4"

describe("Migration 4 down", () => {
    beforeAll(createDatabase)
    afterAll(cleanDatabase)

    it("Migration 4 down", async () => {
        await migration4.down()

        var album = await getOneAlbum()

        expect(album.cover).toBeUndefined()
    }, 1000000)
})