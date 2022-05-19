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

import { IReleaseList } from "musicbrainz-api";
import { Document } from "mongoose";
import { mbApi } from "../../../api/musicbrainzApi";
import { caApi } from "../../../api/coverArtArchive";
import { saveImage } from "../../../file/imageFile";
import { imageModel } from "../../models/imageModel";
import { createFailure } from "../../../../utils/Failure";
import { logInfo } from "../../../../utils/logger";

export async function getAlbumMBIdLegacy(album: Album): Promise<string> {
  let query = `release:${album.title as string}`;

  //Add more info to the query if available
  if (album.artist) {
    query += ` and artist:${album.artist}`;
  }

  try {
    var result = await mbApi.search<IReleaseList>("release", { query });
  } catch (err) {
    throw createFailure(err, __filename, getAlbumMBIdLegacy.name);
  }

  if (!result.releases.length) {
    return null;
  }
  return result.releases[0].id;
}

export async function getAlbumCoverLegacy(
  album: Album & Document<any, any, Album>
): Promise<Image & Document<any, any, Image>> {
  //Fetch Cover art
  let p = new Promise<any>((resolve, reject) => {
    caApi.release(album.mbid, { piece: "front" }, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });

  try {
    var { image, extension } = await p;
  } catch (err) {
    throw createFailure(err, __filename, getAlbumCoverLegacy.name);
  }

  if (image) {
    logInfo(`Found new cover for ${album.id}`, "Migration");
    //Save the image cover on the hard drive

    try {
      var path = await saveImage(image, extension);
    } catch (err) {
      throw createFailure(err, __filename, getAlbumCoverLegacy.name);
    }

    var newCover = new imageModel({ path });

    try {
      await newCover.save();
    } catch (err) {
      throw createFailure(err, __filename, getAlbumCoverLegacy.name);
    }

    return newCover;
  }
  return null;
}

export async function getAlbumCoverLegacy2(
  album: Album & Document<any, any, Album>
): Promise<Image & Document<any, any, Image>> {
  let cover;
  let ext;

  let i = 0;
  //Try fetching cover art for every MB ID
  while (!cover && i < album.mbids.length) {
    try {
      //Fetch Cover art
      let p = new Promise<any>((resolve, reject) => {
        caApi.release(album.mbids[i], { piece: "front" }, (err, data) => {
          if (err) reject(err);
          resolve(data);
        });
      });
      let { image, extension } = await p;
      cover = image;
      ext = extension;
    } catch {
    } finally {
      i++;
    }
  }

  if (cover) {
    logInfo(`Found new cover for ${album.id}`, "Migration");
    //Save the image cover on the hard drive

    try {
      var path = await saveImage(cover, ext);
    } catch (err) {
      throw createFailure(err, __filename, getAlbumCoverLegacy2.name);
    }

    var newCover = new imageModel({ path });

    try {
      await newCover.save();
    } catch (err) {
      throw createFailure(err, __filename, getAlbumCoverLegacy2.name);
    }

    return newCover;
  }
  return null;
}
