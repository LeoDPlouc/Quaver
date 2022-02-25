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
import { migration2 } from "../../src/db/migrationScripts/migration2"
import { migration0 } from "../../src/db/migrationScripts/migration0"
import { migration1 } from "../../src/db/migrationScripts/migration1"

describe("Migration 2 up", () => {
    beforeAll(createDatabase)
    afterAll(cleanDatabase)

    it("Migration 2 up", async () => {
        await migration0.up()
        await migration1.up()
        await migration2.up()

        var album = await getOneAlbum()

        expect(album.mbid).toBeUndefined()
        expect(album.mbids).toBeDefined()
    }, 1000000)
})