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

import "reflect-metadata"
import { Worker } from "worker_threads";
import { connectToDb } from "../access/database/utils";
import { TASK_MANAGER_PERIOD } from "../config/appConfig";
import { CoverCleanerWorker } from "./workers/coverCleaner/coverCleaner";
import { CoverGrabberWorker } from "./workers/coverGrabber/coverGrabber";
import { MetadataGrabberWorker } from "./workers/metadataGrabber/metadataGrabber";
import { SongCollectorWorker } from "./workers/songCollector/songCollector";
import { container } from "tsyringe";

function getWorker(path: string) {
  return new Worker(path, { env: { ...process.env, IS_PROC: "true" } });
}

export function runTaskManager() {
  getWorker(__filename);
}

async function runTasks() {
  await connectToDb("Task Manager")
    .then(async () => {
      await container.resolve(SongCollectorWorker).doWork();
      await container.resolve(MetadataGrabberWorker).doWork();
      await container.resolve(CoverGrabberWorker).doWork()
      await container.resolve(CoverCleanerWorker).doWork();
    });
}

if (process.env.IS_PROC) {
  (async () => {
    while (true) {
      await runTasks();
      await new Promise<never>((resolve) =>
        setTimeout(() => {
          resolve(null);
        }, TASK_MANAGER_PERIOD)
      );
    }
  })();
}
