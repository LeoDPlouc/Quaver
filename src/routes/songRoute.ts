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

import { Router } from "express";
import { protect } from "../middleware/authMiddleware";
import { param, body } from "express-validator";
import { getAllSongInfo, getSongFileById, getSongInfoById, updateLike } from "../controllers/songController";

const router = Router();

router.route("/").get(protect, getAllSongInfo);

router
  .route("/:id")
  .get(
    protect,
    param("id").not().equals("undefined").not().equals("null"),
    getSongInfoById
  );

router
  .route("/:id/stream")
  .get(
    protect,
    param("id").not().equals("undefined").not().equals("null"),
    getSongFileById
  );

router
  .route("/:id/like")
  .patch(
    param("id").not().equals("undefined").not().equals("null"),
    body("like").isIn([-1, 0, 1]),
    updateLike
  );

export = router;
