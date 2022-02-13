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

import request from "supertest"
import { cleanDatabase, createDatabase } from "./util"
import app from "../src/app"

jest.setTimeout(20000)

describe("Song", () => {
    beforeAll(createDatabase)
    afterAll(cleanDatabase)

    describe("Get /songs/", () => {
        it("Should return all songs", async () => {
            var res = await request(app).get("/api/song").expect(200)

            expect(res.body.status).toBe("success")
            expect(res.body.results).toBe(5)
        })
    })
})