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

describe("Song", () => {
    beforeAll(createDatabase)
    afterAll(cleanDatabase)

    var id

    describe("Get /song/", () => {
        it("Should return all songs", async () => {
            var res = await request(app).get("/api/song").expect(200)

            id = res.body.data.songs[0].id

            expect(res.body.statusCode).toBe(0)
            expect(res.body.results).toBe(5)
        })
    })

    describe("Get /song/:id", () => {
        it("Should return one song", async () => {
            var res = await request(app).get(`/api/song/${id}`).expect(200)

            expect(res.body.statusCode).toBe(0)
            expect(res.body.data.song).toBeDefined()
        })

        it("Should fail with id undefined", async () => {
            var res = await request(app).get("/api/song/undefined").expect(200)

            expect(res.body.statusCode).toBe(2)
        })
    })

    describe("Get /song/:id/stream", () => {
        it("Should fail with id undefined", async () => {
            var res = await request(app).get("/api/song/undefined/stream").expect(200)

            expect(res.body.statusCode).toBe(2)
        })
    })

    describe("Get /song/:id/like", () => {
        it("Should change like value to 1", async () => {
            var res = await request(app).patch(`/api/song/${id}/like`).send({ like: 1 }).expect(200)

            expect(res.body.statusCode).toBe(0)

            res = await request(app).get(`/api/song/${id}`).expect(200)

            expect(res.body.statusCode).toBe(0)
            expect(res.body.data.song.like).toBe(1)
        })

        it("Should change like value to 0", async () => {
            var res = await request(app).patch(`/api/song/${id}/like`).send({ like: 0 }).expect(200)

            expect(res.body.statusCode).toBe(0)

            res = await request(app).get(`/api/song/${id}`).expect(200)

            expect(res.body.statusCode).toBe(0)
            expect(res.body.data.song.like).toBe(0)
        })

        it("Should change like value to -1", async () => {
            var res = await request(app).patch(`/api/song/${id}/like`).send({ like: -1 }).expect(200)

            expect(res.body.statusCode).toBe(0)

            res = await request(app).get(`/api/song/${id}`).expect(200)

            expect(res.body.statusCode).toBe(0)
            expect(res.body.data.song.like).toBe(-1)
        })

        it("Should fail with 5", async () => {
            var res = await request(app).patch(`/api/song/${id}/like`).send({ like: 5 }).expect(200)

            expect(res.body.statusCode).toBe(2)
        })

        it("Should fail with id undefined", async () => {
            var res = await request(app).patch("/api/song/undefined/like").send({ like: 0 }).expect(200)

            expect(res.body.statusCode).toBe(0)
        })
    })
})