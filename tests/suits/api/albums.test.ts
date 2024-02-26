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

import request from "supertest";
import { cleanDatabase } from "../../util";
import app from '../../../src/app'
import { AlbumModel } from "../../../src/access/database/models/albumModel";
import { container } from "tsyringe";
import { getCleanAlbumDb } from "../../testData/albumTestData";
import { SongModel } from "../../../src/access/database/models/songModel";
import { getCleanSongDb } from "../../testData/songTestData";

describe("Album", () => {

  describe("Get /album/", () => {
    beforeEach(cleanDatabase);

    it("Should return all albums", async () => {
      const albumModel = container.resolve(AlbumModel)

      await albumModel.create(getCleanAlbumDb())

      const res = await request(app).get("/api/album").expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.results).toBe(1);
    });
  });

  describe("Get /album/:id", () => {
    beforeEach(cleanDatabase);

    it("Should return one album", async () => {
      const albumModel = container.resolve(AlbumModel)

      const id = (await albumModel.create(getCleanAlbumDb())).id

      const res = await request(app).get(`/api/album/${id}`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.data.album).toBeDefined();
    });

    it("Should fail with id undefined", async () => {
      const res = await request(app).get("/api/album/undefined").expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id", async () => {
      const res = await request(app).get("/api/album/null").expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });

  describe("Get /album/:id/songs", () => {
    beforeEach(cleanDatabase);

    it("Should return album's songs", async () => {
      const albumModel = container.resolve(AlbumModel)
      const songModel = container.resolve(SongModel)

      const id = (await albumModel.create(getCleanAlbumDb())).id
      await songModel.create(
        {
          ...getCleanSongDb(),
          albumV2: id
        })

      const res = await request(app).get(`/api/album/${id}/songs`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.results).toBe(1);
    });

    it("Should fail with id undefined", async () => {
      const res = await request(app)
        .get("/api/album/undefined/songs")
        .expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id", async () => {
      const res = await request(app).get("/api/album/null/songs").expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });
});