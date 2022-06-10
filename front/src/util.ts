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

import { router } from "./app";
import { ImageSize } from "./models";

export function openPresentation(path: string) {
  router.push({ path });
}

export function getCoverURL(id: string, size: ImageSize | string) {
  return `/api/image/${id}/file/${size}`;
}

export function formatDuration(duration: number): string {
  try {
    let seconds = Number(duration) % 60;
    let secondsString = String(seconds).split(".")[0];
    if (secondsString.length == 1) secondsString = "0" + secondsString;
    if (secondsString.length == 0) secondsString = "00";
    let minutes = Number(duration) / 60;
    let minutesString = String(minutes).split(".")[0];
    if (minutesString.length == 0) minutesString = "0";
    return `${minutesString}:${secondsString}`;
  } catch (error) {}
  return String(duration);
}
