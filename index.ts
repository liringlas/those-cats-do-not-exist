import { get, Response } from 'superagent';
import { join } from 'path';
import * as fileType from 'file-type';
import { ensureDir, writeFile } from 'fs-extra';

const URL = 'https://thiscatdoesnotexist.com/';
const INTERVAL = 1024;

const isValid = (res: Response, typeInfo: fileType.FileTypeResult | null) => {
  if (!Buffer.isBuffer(res.body)) {
    return false;
  }
  if (!typeInfo || typeInfo.mime !== 'image/jpeg' || !typeInfo.ext) {
    return false;
  }
  return true;
};

// TODO: Add morgan file logging
// TODO: Add cron job for archiving, cleaning, and (maybe) sending archived data
const run = async (url: string, interval: number) => {
  let previousBuffer: Buffer;
  await ensureDir(join(__dirname, 'cats'));

  setInterval(() => {
    get(url).then((res: Response) => {
      const typeInfo = fileType(res.body);
      if (!typeInfo || !isValid(res, typeInfo)) {
        return;
      }
      if (Buffer.isBuffer(previousBuffer) && previousBuffer.equals(res.body)) {
        return;
      }
      previousBuffer = res.body;
      const fileName = `${Date.now()}.${typeInfo.ext}`;
      const filePath = join(__dirname, 'cats', fileName);
      writeFile(filePath, res.body);
    });
  }, interval);
};

run(URL, INTERVAL);
