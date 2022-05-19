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
import { getAllAlbumsCtrl, getAlbumCtrl, getAlbumSongsCtrl } from "../controllers/albumController"
import { protect } from "../middleware/authMiddleware"
import { param } from "express-validator"

const router = Router()


router.route("/")
    .get(
        protect,
        getAllAlbumsCtrl
    )

router.route("/:id")
    .get(
        protect,
        param("id").not().equals("undefined").not().equals("null"),
        getAlbumCtrl
    )

router.route("/:id/songs")
    .get(
        protect,
        param("id").not().equals("undefined").not().equals("null"),
        getAlbumSongsCtrl
    )

export = router