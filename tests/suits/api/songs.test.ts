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
import { container } from "tsyringe";
import { SongModel } from "../../../src/access/database/models/songModel";
import { getCleanAlbumDb } from "../../testData/albumTestData";
import { getCleanSongDb } from "../../testData/songTestData";

describe("Song", () => {

  describe("Get /song/", () => {
    beforeEach(cleanDatabase);

    it("Should return all songs", async () => {
      const songModel = container.resolve(SongModel)

      await songModel.create(getCleanSongDb())

      const res = await request(app).get("/api/song").expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.results).toBe(1);
    });
  });

  describe("Get /song/:id", () => {
    beforeEach(cleanDatabase);

    it("Should return one song", async () => {
      const songModel = container.resolve(SongModel)

      const id = (await songModel.create(getCleanSongDb())).id

      const res = await request(app).get(`/api/song/${id}`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.data.song).toBeDefined();
    });

    it("Should fail with id undefined", async () => {
      const res = await request(app).get("/api/song/undefined").expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id", async () => {
      const res = await request(app).get("/api/song/null").expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });

  describe("Get /song/:id/stream", () => {
    beforeEach(cleanDatabase);

    it("Should fail with id undefined", async () => {
      const res = await request(app)
        .get("/api/song/undefined/stream")
        .expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id ", async () => {
      const res = await request(app).get("/api/song/null/stream").expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });

  describe("Get /song/:id/like", () => {
    beforeEach(cleanDatabase);

    it("Should change like value to 1", async () => {
      const songModel = container.resolve(SongModel)

      const id = (await songModel.create(getCleanSongDb())).id

      let res = await request(app)
        .patch(`/api/song/${id}/like`)
        .send({ like: 1 })
        .expect(200);

      expect(res.body.statusCode).toBe(0);

      res = await request(app).get(`/api/song/${id}`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.data.song.like).toBe(1);
    });

    it("Should change like value to 0", async () => {
      const songModel = container.resolve(SongModel)

      const id = (await songModel.create(getCleanSongDb())).id

      let res = await request(app)
        .patch(`/api/song/${id}/like`)
        .send({ like: 0 })
        .expect(200);

      expect(res.body.statusCode).toBe(0);

      res = await request(app).get(`/api/song/${id}`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.data.song.like).toBe(0);
    });

    it("Should change like value to -1", async () => {
      const songModel = container.resolve(SongModel)

      const id = (await songModel.create(getCleanSongDb())).id

      let res = await request(app)
        .patch(`/api/song/${id}/like`)
        .send({ like: -1 })
        .expect(200);

      expect(res.body.statusCode).toBe(0);

      res = await request(app).get(`/api/song/${id}`).expect(200);

      expect(res.body.statusCode).toBe(0);
      expect(res.body.data.song.like).toBe(-1);
    });

    it("Should fail with 5", async () => {
      const songModel = container.resolve(SongModel)

      const id = (await songModel.create(getCleanSongDb())).id
      
      const res = await request(app)
        .patch(`/api/song/${id}/like`)
        .send({ like: 5 })
        .expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with id undefined", async () => {
      const res = await request(app)
        .patch("/api/song/undefined/like")
        .send({ like: 0 })
        .expect(200);

      expect(res.body.statusCode).toBe(2);
    });

    it("Should fail with null id", async () => {
      const res = await request(app)
        .patch("/api/song/null/like")
        .send({ like: 0 })
        .expect(200);

      expect(res.body.statusCode).toBe(2);
    });
  });
});