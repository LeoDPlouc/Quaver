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

import { AlbumDb } from "../../src/access/database/models/interfaces/albumDb"
import { Album } from "../../src/models/album"

export function getCleanAlbumDb(): AlbumDb {
    return {
        title: "test title",
        mbid: "1a2z3e4r",
        lastUpdated: Date.now(),
        lastCoverUpdate: Date.now()
    }
}

export function getCleanAlbum(): Album {
    return {
        title: "test title",
        mbid: "1a2z3e4r",
        lastUpdated: Date.now(),
        lastCoverUpdate: Date.now()
    }
}

export function getAlbumDbNeverUpdated(): AlbumDb {
    return {}
}

export function getAlbumNeverUpdated(): Album {
    return {}
}

export function getAlbumDbNeverCoverGrabbed(): AlbumDb {
    return {}
}

export function getAlbumNeverCoverGrabbed(): Album {
    return {}
}

export function getAlbumDbToUpdate(): AlbumDb {
    return {
        lastUpdated: 0
    }
}

export function getAlbumToUpdate(): Album {
    return {
        lastUpdated: 0
    }
}

export function getAlbumDbToCoverGrab(): AlbumDb {
    return {
        lastCoverUpdate: 0
    }
}

export function getAlbumToCoverGrab(): Album {
    return {
        lastCoverUpdate: 0
    }
}
