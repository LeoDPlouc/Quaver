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

import { FpcalcResult } from "fpcalc";
import { FPCALC_PATH } from "../../config/config";
import fp from "fpcalc-async";
import { parseFile } from "music-metadata";
import Path from "path";
import { createFailure, Failable, Failure } from "../../utils/Failable";

export async function getAcoustid(songPath: string): Promise<Failable<string>> {
  let fingerprint: FpcalcResult<string>;

  //If fpcalc isn't in PATH, use fpcalc with its path
  try {
    if (FPCALC_PATH) fingerprint = await fp(songPath, { command: FPCALC_PATH });
    else fingerprint = await fp(songPath);
  } catch (err) {
    return { failure: createFailure(err, __filename, getAcoustid.name) };
  }

  return { result: fingerprint.fingerprint };
}

export async function getMetadataFromFile(
  songPath: string
): Promise<Failable<Song>> {
  try {
    var tag = await parseFile(songPath);
  } catch (err) {
    return {
      failure: createFailure(err, __filename, getMetadataFromFile.name),
    };
  }

  let format = Path.extname(songPath);

  let result = await getAcoustid(songPath);
  if (result.failure) {
    return {
      failure: createFailure(
        "AcoustId parsing error",
        __filename,
        getMetadataFromFile.name,
        result.failure
      ),
    };
  }
  let fp = result.result;

  return {
    result: {
      title: tag.common.title,
      n: tag.common.track.no,
      artist: tag.common.albumartist,
      album: tag.common.album,
      year: tag.common.year,
      duration: tag.format.duration,
      like: 0,
      path: songPath,
      format: format,
      acoustid: fp,
    },
  };
}
