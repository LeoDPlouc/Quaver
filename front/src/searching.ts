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

import { Album, Artist, Song } from "./models";

export function search(queryString: any, obj: Song | Album | Artist) {

    var query = queryString as string

    if (!query.length) return true

    var target = ""
    if ((obj as Song).title) target = (obj as Song).title
    if ((obj as Album).title) target = (obj as Album).title
    if ((obj as Artist).name) target = (obj as Artist).name

    if (!target) return false
    var match = target.toLowerCase().match(query.toLowerCase())
    return match != null && match.length > 0
}