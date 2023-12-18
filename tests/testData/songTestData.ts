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

import { SongDb } from "../../src/access/database/models/interfaces/songDb"
import { Song } from "../../src/models/song"

export function getCleanSongDb(): SongDb {
    return {
        path: "/",
        title: "test title",
        mbid: "1a2z3e4r",
        lastUpdated: Date.now()
    }
}

export function getCleanSong(): Song {
    return {
        path: "/",
        title: "test title",
        mbid: "1a2z3e4r",
        lastUpdated: Date.now()
    }
}

export function getSongDbWithoutMbid(): SongDb {
    return {
        path: "/"
    }
}

export function getSongWithoutMbid(): Song {
    return {
        path: "/"
    }
}

export function getSongDbToUpdate(): SongDb {
    return {
        path: "/",
        lastUpdated: 0
    }
}

export function getSongToUpdate(): Song {
    return {
        path: "/",
        lastUpdated: 0
    }
}

export function getSongDbNeverUpdated(): SongDb {
    return {
        path: "/"
    }
}

export function getSongNeverUpdated(): Song {
    return {
        path: "/"
    }
}