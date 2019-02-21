import * as fileType from 'file-type';
import { ensureDir, writeFile } from 'fs-extra';
import { join } from 'path';
import { get, Response } from 'superagent';

import { validateResponse } from './validateResponse';
import { INTERVAL, URL } from './env';

// TODO: Add morgan file logging
// TODO: Add cron job for archiving, cleaning, and (maybe) sending archived data
const run = async (url: string, interval: number) => {
  let previousBuffer: Buffer;
  const targetDirPath = join(__dirname, 'cats');
  await ensureDir(targetDirPath);

  setInterval(() => {
    get(url)
      .then((res: Response) => {
        const typeInfo = fileType(res.body);

        if (!typeInfo || !validateResponse(res, typeInfo)) {
          return;
        }
        if (Buffer.isBuffer(previousBuffer) && previousBuffer.equals(res.body)) {
          return;
        }
        previousBuffer = res.body;

        const fileName = `${Date.now()}.${typeInfo.ext}`;
        const filePath = join(targetDirPath, fileName);

        writeFile(filePath, res.body);
      })
      .catch(err => console.error(err));
  }, interval);
};

run(URL, INTERVAL);
