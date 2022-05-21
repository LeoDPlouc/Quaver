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

import { Worker } from "worker_threads";
import { connectToDb } from "../access/database/utils";
import songCollector from "./tasks/songCollector";
import metadataGrabber from "./tasks/metadataGrabber";
import coverGrabber from "./tasks/coverGrabber";

function getWorker(path: string) {
  return new Worker(path, { env: { ...process.env, IS_PROC: "true" } });
}

export function runTaskManager() {
  getWorker(__filename);
}

async function runTasks() {
  await connectToDb("Task Manager").then(async () => {
    await songCollector();
    await metadataGrabber();
    await coverGrabber();
  });
}

if (process.env.IS_PROC) {
  (async () => {
    while (true) {
      await runTasks();
      await new Promise((resolve) => setTimeout(() => {}, 60 * 1000));
    }
  })();
}
