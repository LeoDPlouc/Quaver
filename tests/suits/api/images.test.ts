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
import { cleanDatabase } from "../../util";
import app from '../../../src/app'
import { container } from "tsyringe";
import { ImageModel } from "../../../src/access/database/models/imageModel";
import { getCleanImage } from "../../testData/imageTestData";

describe("Image", () => {

    describe("Get /image/", () => {
        beforeEach(cleanDatabase);

        it("Should return all images", async () => {
            const imageModel = container.resolve(ImageModel)

            await imageModel.create(getCleanImage())
            
            const res = await request(app).get("/api/image").expect(200)

            expect(res.body.statusCode).toBe(0)
            expect(res.body.results).toBe(1)
        })
    })

    describe("Get /image/:id", () => {
        beforeEach(cleanDatabase);

        it("Should return one image", async () => {
            const imageModel = container.resolve(ImageModel)

            const id = (await imageModel.create(getCleanImage())).id

            const res = await request(app).get(`/api/image/${id}`).expect(200)

            expect(res.body.statusCode).toBe(0)
            expect(res.body.data.image).toBeDefined()
        })

        it("Should fail with id undefined", async () => {
            const res = await request(app).get("/api/image/undefined").expect(200)

            expect(res.body.statusCode).toBe(2)
        })

        it("Should fail with null id", async () => {
            const res = await request(app).get("/api/image/null").expect(200)

            expect(res.body.statusCode).toBe(2)
        })
    })

    describe("Get /image/:id/file", () => {
        beforeEach(cleanDatabase);

        it("Should fail with id undefined", async () => {
            const res = await request(app).get("/api/image/undefined/file").expect(200)

            expect(res.body.statusCode).toBe(2)
        })

        it("Should fail with null id", async () => {
            const res = await request(app).get("/api/image/null/file").expect(200)

            expect(res.body.statusCode).toBe(2)
        })
    })
})