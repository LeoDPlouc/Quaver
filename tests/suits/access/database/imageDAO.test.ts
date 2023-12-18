// Quaver is a self-hostable music player and music library manager
// Copyright (C) 2023  DPlouc
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

import { container } from "tsyringe"
import { cleanDatabase, cleanTestEnvironnement } from "../../../util"
import { ImageModel } from "../../../../src/access/database/models/imageModel"
import { ImageDAO } from "../../../../src/access/database/imageDAO"
import { ImageModelMock } from "../../../mock/access/models/imageModel.mock"
import { DAOException } from "../../../../src/access/database/exceptions/DAOException"
import { getCleanImage, getImageWithoutImage } from "../../../testData/imageTestData"

describe("ImageDAO tests", () => {
    describe("getAllImagesModels test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get all models", async () => {
            const imageModel = container.resolve(ImageModel)
            const imageDAO = container.resolve(ImageDAO)

            await imageModel.create(getCleanImage())

            let results = await imageDAO.getAllImagesModels()

            expect(results).toHaveLength(1)
        })

        it("Should throw error on model error", async () => {
            const imageModelMock = new ImageModelMock()
            imageModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const imageDAO = new ImageDAO(imageModelMock)

            imageDAO.getAllImagesModels().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getImageModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model by id", async () => {
            const imageModel = container.resolve(ImageModel)
            const imageDAO = container.resolve(ImageDAO)

            await imageModel.create(getCleanImage())
            let id = await imageModel.find({})
                .then(results => results[0].id)

            let result = await imageDAO.getImageModel(id)

            expect(result.path).toBe(getCleanImage().path)
        })

        it("Should throw error on model error", async () => {
            const imageModelMock = new ImageModelMock()
            imageModelMock.findById = jest.fn(() => { throw new Error("Test error") })

            const imageDAO = new ImageDAO(imageModelMock)

            imageDAO.getImageModel("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("createImageModel test", () => {
        beforeEach(cleanDatabase)

        it("Should create an image", async () => {
            const imageModel = container.resolve(ImageModel)
            const imageDAO = container.resolve(ImageDAO)

            let id = await imageDAO.createImageModel(getCleanImage())

            let result = await imageModel.findById(id)

            expect(result).toBeDefined()
            expect(result?.path).toBe(getCleanImage().path)
        })

        it("Should throw error on model error", async () => {
            const imageModelMock = new ImageModelMock()
            imageModelMock.create = jest.fn(() => { throw new Error("Test error") })

            const imageDAO = new ImageDAO(imageModelMock)

            imageDAO.createImageModel(getCleanImage()).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("deleteImageModel test", () => {
        beforeEach(cleanDatabase)

        it("Should delete image", async () => {
            const imageModel = container.resolve(ImageModel)
            const imageDAO = container.resolve(ImageDAO)

            await imageModel.create(getCleanImage())
            let id = await imageModel.find({})
                .then(results => results[0].id)

            await imageDAO.deleteImageModel(id)
            let result = await imageModel.find()

            expect(result).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const imageModelMock = new ImageModelMock()
            imageModelMock.findByIdAndDelete = jest.fn(() => { throw new Error("Test error") })

            const imageDAO = new ImageDAO(imageModelMock)

            imageDAO.deleteImageModel("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getTinyLessImageModel test", () => {
        beforeEach(cleanDatabase)

        it("Should get models without tiny field", async () => {
            const imageModel = container.resolve(ImageModel)
            const imageDAO = container.resolve(ImageDAO)

            await imageModel.create(getImageWithoutImage())

            let results = await imageDAO.getTinyLessImageModel()

            expect(results).toHaveLength(1)
        })

        it("Should not get models with tiny field", async () => {
            const imageModel = container.resolve(ImageModel)
            const imageDAO = container.resolve(ImageDAO)

            await imageModel.create(getCleanImage())

            let results = await imageDAO.getTinyLessImageModel()

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const imageModelMock = new ImageModelMock()
            imageModelMock.find = jest.fn(() => { throw new Error("Test error") })

            const imageDAO = new ImageDAO(imageModelMock)

            imageDAO.getTinyLessImageModel().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })
})