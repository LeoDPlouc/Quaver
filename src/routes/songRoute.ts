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

import { Router } from "express"

import { getAllSongsInfo, getOneSongInfo, updateSongInfo, getSongStream, updateLike } from "../controllers/songController"
import { protect } from "../middleware/authMiddleware"

const router = Router()

router.route("/")
    .get(protect, getAllSongsInfo)

router.route("/:id")
    .get(protect, getOneSongInfo)
    .patch(protect, updateSongInfo)

router.route("/:id/stream")
    .get(protect, getSongStream)

router.route("/:id/like")
    .patch(updateLike)

export = router