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
import { migration1 } from "../../src/access/database/migration/migrationScripts/migration1"
import { migration0 } from "../../src/access/database/migration/migrationScripts/migration0"

describe("Migration 1 up", () => {
    beforeAll(createDatabase)
    afterAll(cleanDatabase)

    it("Migration 1 up", async () => {
        await migration0.up()
        await migration1.up()

        var album = await getOneAlbum()

        expect(album.cover).toBeDefined()
    }, 1000000)
})