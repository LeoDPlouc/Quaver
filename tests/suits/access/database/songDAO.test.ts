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
import { SongModel } from "../../../../src/access/database/models/songModel"
import { SongDAO } from "../../../../src/access/database/songDAO"
import { SongModelMock } from "../../../mock/access/models/songModel.mock"
import { SongMapper } from "../../../../src/mappers/songMapper"
import { DAOException } from "../../../../src/access/database/exceptions/DAOException"
import { getCleanSong, getCleanSongDb, getSongDbNeverUpdated, getSongDbToUpdate, getSongDbWithoutMbid } from "../../../testData/songTestData"

describe("SongDAO tests", () => {
    describe("getAllSongModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get all models", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getCleanSongDb())

            let results = await songDAO.getAllSongModel()

            expect(results).toHaveLength(1)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.find = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.getAllSongModel().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getSongModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model by id", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getCleanSongDb())
            let id = await songModel.find({})
                .then(results => results[0].id)

            let result = await songDAO.getSongModel(id)

            expect(result.title).toBe(getCleanSong().title)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.find = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.getSongModel("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("updateSongModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should update model the model", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getCleanSongDb())
            let id = await songModel.find({})
                .then(results => results[0].id)
                
            const title = "new title"
            await songDAO.updateSongModel({
                ...getCleanSong(),
                title,
                id
            })

            let result = await songModel.findById(id)

            expect(result?.title).toBe(title)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.findByIdAndUpdate = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.updateSongModel(getCleanSong()).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("createSongModel test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should create a song", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            let id = await songDAO.createSongModel(getCleanSong())

            let result = await songModel.findById(id)

            expect(result).toBeDefined()
            expect(result?.title).toBe(getCleanSong().title)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.create = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.createSongModel(getCleanSong()).catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("findSongModelByPath test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should find model by path", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getCleanSongDb())

            let result = await songDAO.findSongModelByPath(getCleanSong().path)

            expect(result).toBeDefined()
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.find = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.findSongModelByPath("").catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getPathsFromAllSong test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get all song's path", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getCleanSongDb())

            let results = await songDAO.getPathsFromAllSong()

            expect(results).toHaveLength(1)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.find = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.getPathsFromAllSong().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getAlbumModelToCoverGrab test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model with no mbid", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getSongDbWithoutMbid())

            let results = await songDAO.getMbidlessSongModel()

            expect(results).toHaveLength(1)
        })

        it("Should not get model with mbid", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getCleanSongDb())

            let results = await songDAO.getMbidlessSongModel()

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.find = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.getMbidlessSongModel().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })

    describe("getSongModelForMetadataGrabber test", () => {
        beforeEach(cleanDatabase)
        beforeEach(cleanTestEnvironnement)

        it("Should get model updated too long ago", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getSongDbToUpdate())

            let results = await songDAO.getSongModelForMetadataGrabber()

            expect(results).toHaveLength(1)
        })

        it("Should get model never updated", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getSongDbNeverUpdated())

            let results = await songDAO.getSongModelForMetadataGrabber()

            expect(results).toHaveLength(1)
        })

        it("Should not get model recently updated", async () => {
            let songModel = container.resolve(SongModel)
            let songDAO = container.resolve(SongDAO)

            await songModel.create(getCleanSongDb())

            let results = await songDAO.getSongModelForMetadataGrabber()

            expect(results).toHaveLength(0)
        })

        it("Should throw error on model error", async () => {
            const songModelMock = new SongModelMock()
            songModelMock.find = jest.fn(() => { throw new Error("Test error") })

            let songMapper = container.resolve(SongMapper)
            let songDAO = new SongDAO(songModelMock, songMapper)

            songDAO.getSongModelForMetadataGrabber().catch(err => expect(err).toBeInstanceOf(DAOException))
        })
    })
})